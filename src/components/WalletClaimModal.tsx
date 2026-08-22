import React, { useState } from 'react';
import { WalletState, connectMonadWallet, claimRewardOnChain } from '../lib/web3Wallet';
import { Wallet, CheckCircle, ExternalLink, AlertCircle, Loader2, Coins, ShieldCheck, X } from 'lucide-react';

interface WalletClaimModalProps {
    totalPoints: number;
    isOpen: boolean;
    onClose: () => void;
}

export const WalletClaimModal: React.FC<WalletClaimModalProps> = ({
    totalPoints,
    isOpen,
    onClose
}) => {
    const [wallet, setWallet] = useState<WalletState | null>(null);
    const [customAddress, setCustomAddress] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [statusMsg, setStatusMsg] = useState<string>('');
    const [txHash, setTxHash] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');

    if (!isOpen) return null;

    const isEligibleForRedemption = totalPoints >= 1.0;

    const handleConnectWallet = async () => {
        try {
            setErrorMsg('');
            setLoading(true);
            setStatusMsg('Connecting Monad Testnet Wallet...');
            const walletState = await connectMonadWallet();
            setWallet(walletState);
            setCustomAddress(walletState.address);
            setStatusMsg('Wallet Connected!');
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to connect wallet');
        } finally {
            setLoading(false);
        }
    };

    const handleClaimOnChain = async () => {
        const targetAddress = wallet?.address || customAddress;

        if (!targetAddress || !targetAddress.startsWith('0x') || targetAddress.length !== 42) {
            setErrorMsg('Please enter or connect a valid EVM/Monad wallet address');
            return;
        }

        if (!isEligibleForRedemption) {
            setErrorMsg('Minimum redemption threshold is 1 MON. Keep playing to earn 1 MON!');
            return;
        }

        try {
            setErrorMsg('');
            setLoading(true);
            setStatusMsg('Requesting verified claim voucher from Monad Arcade backend...');

            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
            const nonce = Date.now();

            // Request cryptographic signature voucher from FastAPI backend
            const response = await fetch(`${BACKEND_URL}/api/rewards/voucher`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_address: targetAddress,
                    amount: Math.floor(totalPoints * 1000), // convert to uint points
                    nonce: nonce
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate reward voucher from backend relayer');
            }

            const voucher = await response.json();
            setStatusMsg('Voucher generated! Confirming transaction on Monad Testnet...');

            // Submit transaction to Monad Escrow Contract
            const hash = await claimRewardOnChain(
                voucher.contract_address,
                voucher.amount,
                voucher.nonce,
                voucher.signature
            );

            setTxHash(hash);
            setStatusMsg('✓ Redemption successful! MON transferred to your wallet.');
        } catch (err: any) {
            setErrorMsg(err.message || 'Transaction failed or rejected by user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel border border-purple-500/40 rounded-3xl p-6 relative animate-scale-up shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800 transition"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-400">
                        <Coins className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Redeem Monad Rewards</h3>
                        <p className="text-xs text-zinc-400">Off-chain accounting $\rightarrow$ On-chain transfer</p>
                    </div>
                </div>

                {/* Claimable Balance Card */}
                <div className="bg-gradient-to-r from-purple-950/60 to-zinc-900 border border-purple-500/30 rounded-2xl p-4 mb-4 flex items-center justify-between">
                    <div>
                        <span className="text-xs text-zinc-400 uppercase font-semibold">Claimable Balance</span>
                        <div className="text-3xl font-black text-white font-mono">{totalPoints.toFixed(3)} MON</div>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-purple-400 opacity-80" />
                </div>

                {/* Minimum Threshold Status Pill */}
                <div className={`p-3 rounded-xl text-xs font-semibold mb-5 flex items-center justify-between ${isEligibleForRedemption
                        ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                        : 'bg-amber-950/40 border border-amber-500/40 text-amber-300'
                    }`}>
                    <span>Minimum Redemption: <strong>1.0 MON</strong></span>
                    <span className="font-mono">{isEligibleForRedemption ? '✓ Eligible' : '🔒 Locked'}</span>
                </div>

                {/* Wallet Address Input Box */}
                <div className="mb-5 space-y-2">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Wallet Address</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="0x..."
                            value={customAddress}
                            onChange={(e) => setCustomAddress(e.target.value)}
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                        />
                        <button
                            onClick={handleConnectWallet}
                            className="px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition shrink-0"
                        >
                            <Wallet className="w-3.5 h-3.5" />
                            Connect
                        </button>
                    </div>
                </div>

                {/* Status message or errors */}
                {statusMsg && (
                    <div className="mb-4 p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl text-xs text-purple-200 flex items-center gap-2">
                        {loading && <Loader2 className="w-4 h-4 animate-spin text-purple-400" />}
                        <span>{statusMsg}</span>
                    </div>
                )}

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Confirmed Tx hash display */}
                {txHash && (
                    <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                            <CheckCircle className="w-4 h-4" />
                            Redemption Successful!
                        </div>
                        <p className="text-[11px] text-zinc-300 font-mono break-all mb-2">{txHash}</p>
                        <a
                            href={`https://testnet.monadexplorer.com/tx/${txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 underline hover:text-emerald-200"
                        >
                            View on Monad Explorer <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                )}

                {/* Redeem Action Button */}
                <button
                    onClick={handleClaimOnChain}
                    disabled={loading || !isEligibleForRedemption}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition ${!isEligibleForRedemption || loading
                            ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white monad-glow-cyan'
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Processing Redemption...
                        </>
                    ) : !isEligibleForRedemption ? (
                        'Minimum withdrawal is 1.0 MON'
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4" /> REDEEM {totalPoints.toFixed(3)} MON
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
