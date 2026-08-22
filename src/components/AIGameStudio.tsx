import React, { useState } from 'react';
import { Sparkles, Play, Loader2, Wand2, Cpu, CheckCircle, ExternalLink, ShieldCheck, Coins } from 'lucide-react';
import { connectMonadWallet } from '../lib/web3Wallet';
import { supabase } from '../lib/supabaseClient';

export const AIGameStudio: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [generatedGame, setGeneratedGame] = useState<{ title: string; code: string } | null>(null);

    // Publishing & 0.1 MON payment state machine (Feature 4)
    const [publishingState, setPublishingState] = useState<'DRAFT' | 'GENERATED' | 'PAYMENT_PENDING' | 'PUBLISHED'>('DRAFT');
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [publishTxHash, setPublishTxHash] = useState<string>('');
    const [publishError, setPublishError] = useState<string>('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        try {
            setLoading(true);
            setPublishError('');
            setPublishingState('DRAFT');

            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

            const res = await fetch(`${BACKEND_URL}/api/ai/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!res.ok) throw new Error('AI Generation failed');

            const data = await res.json();
            setGeneratedGame({
                title: data.title,
                code: data.code
            });
            setPublishingState('GENERATED');
        } catch (err) {
            alert('AI pipeline fallback mode active!');
        } finally {
            setLoading(false);
        }
    };

    // Feature 4: Pay 0.1 MON Publishing Fee via Web3 Wallet
    const handlePublishGame = async () => {
        if (!generatedGame) return;

        try {
            setIsPublishing(true);
            setPublishError('');
            setPublishingState('PAYMENT_PENDING');

            // Connect user wallet
            const walletState = await connectMonadWallet();

            // Send 0.1 MON transaction on Monad Testnet
            const provider = (window as any).ethereum;
            if (!provider) throw new Error('No Web3 wallet provider found');

            // 0.1 MON in Hex Wei (0.1 * 10^18 = 100000000000000000 wei = 0x16345785D8A0000)
            const txParams = {
                from: walletState.address,
                to: '0x9fE46736679d2D5165B94e37C6bDDE8233777777', // Escrow / platform address
                value: '0x16345785D8A0000'
            };

            const txHash = await provider.request({
                method: 'eth_sendTransaction',
                params: [txParams]
            });

            setPublishTxHash(txHash);

            // Record published game in Supabase `generated_games` table
            await supabase.from('generated_games').insert({
                prompt: prompt,
                title: generatedGame.title,
                code: generatedGame.code,
                publishing_fee: 0.1,
                payment_transaction_hash: txHash,
                payment_status: 'PAID',
                publication_status: 'PUBLISHED'
            });

            setPublishingState('PUBLISHED');
        } catch (err: any) {
            setPublishError(err.message || 'Payment failed or cancelled');
            setPublishingState('GENERATED');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="w-full h-full max-w-6xl mx-auto p-4 md:p-6 flex flex-col pb-24 overflow-y-auto no-scrollbar">

            {/* Studio Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-400">
                    <Wand2 className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">AI Game Studio</h1>
                    <p className="text-xs text-zinc-400">Prompt &rarr; Free Instant Preview &rarr; 0.1 MON to Publish</p>
                </div>
            </div>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                {/* Left Column: Prompt Controls */}
                <div className="md:col-span-5 glass-panel rounded-3xl p-6 border border-white/10 space-y-4 shadow-2xl">
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                        Describe your game idea
                    </label>
                    <textarea
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. A neon space shooter where clicking glowing asteroids increases your Monad score..."
                        className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition resize-none"
                    />

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className={`w-full py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${loading || !prompt.trim()
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white monad-glow'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                                Executing OpenRouter AI Pipeline...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                                Generate & Preview (FREE)
                            </>
                        )}
                    </button>

                    {/* Publishing Box (Feature 4) */}
                    {generatedGame && (
                        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3 animate-fade-in">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-white">Publishing Fee:</span>
                                <span className="font-mono font-bold text-yellow-400 flex items-center gap-1">
                                    <Coins className="w-3.5 h-3.5" /> 0.1 MON
                                </span>
                            </div>

                            {publishingState === 'PUBLISHED' ? (
                                <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl space-y-2">
                                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                                        <CheckCircle className="w-4 h-4" />
                                        ✓ Game Published to Monad Feed!
                                    </div>
                                    <a
                                        href={`https://testnet.monadexplorer.com/tx/${publishTxHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-mono underline"
                                    >
                                        View Tx on Explorer <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            ) : (
                                <button
                                    onClick={handlePublishGame}
                                    disabled={isPublishing}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition monad-glow-cyan"
                                >
                                    {isPublishing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Confirming 0.1 MON Payment...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" /> Pay 0.1 MON & Publish Game
                                        </>
                                    )}
                                </button>
                            )}

                            {publishError && (
                                <p className="text-[11px] text-red-400">{publishError}</p>
                            )}
                        </div>
                    )}

                    <div className="p-3 bg-purple-950/30 border border-purple-800/30 rounded-xl text-[11px] text-purple-300 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>Previewing is 100% free. 0.1 MON publishing fee is only charged upon final publishing.</span>
                    </div>
                </div>

                {/* Right Column: Generated Game Sandbox Canvas */}
                <div className="md:col-span-7">
                    {generatedGame ? (
                        <div className="glass-panel rounded-3xl p-5 border border-cyan-500/40 space-y-3 animate-scale-up shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Play className="w-4 h-4 text-cyan-400" />
                                    {generatedGame.title}
                                </h3>
                                <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                                    {publishingState === 'PUBLISHED' ? 'Published' : 'Draft Preview'}
                                </span>
                            </div>

                            <div className="w-full h-[480px] rounded-2xl bg-black overflow-hidden border border-white/10">
                                <iframe
                                    srcDoc={generatedGame.code}
                                    title="AI Generated Game Preview"
                                    sandbox="allow-scripts"
                                    className="w-full h-full border-none"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 flex flex-col items-center justify-center gap-3 h-[480px]">
                            <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                <Wand2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-sm font-bold text-white">Your AI Game Sandbox</h3>
                            <p className="text-xs text-zinc-400 max-w-sm">Enter a prompt on the left to synthesize a live HTML5 canvas game generated on the fly.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
