import React from 'react';
import { BarChart3, ShieldCheck, Gamepad2, Users, Layers, Zap } from 'lucide-react';
import { GAMES_REGISTRY } from '../data/gamesRegistry';

export const AnalyticsView: React.FC<{ userPoints: number }> = ({ userPoints }) => {
    return (
        <div className="w-full h-full max-w-md mx-auto p-4 flex flex-col pb-20 overflow-y-auto no-scrollbar">
            {/* Title */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-cyan-400">
                    <BarChart3 className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Monad Arcade Stats</h1>
                    <p className="text-xs text-zinc-400">Verified platform metrics</p>
                </div>
            </div>

            {/* Real Platform Counts */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="glass-panel rounded-2xl p-4 border border-purple-500/30">
                    <Gamepad2 className="w-5 h-5 text-purple-400 mb-2" />
                    <div className="text-2xl font-black text-white font-mono">{GAMES_REGISTRY.length}</div>
                    <span className="text-xs text-zinc-400 font-semibold">Registered Games</span>
                </div>

                <div className="glass-panel rounded-2xl p-4 border border-cyan-500/30">
                    <Layers className="w-5 h-5 text-cyan-400 mb-2" />
                    <div className="text-2xl font-black text-white font-mono">10143</div>
                    <span className="text-xs text-zinc-400 font-semibold">Monad Chain ID</span>
                </div>

                <div className="glass-panel rounded-2xl p-4 border border-yellow-500/30">
                    <Zap className="w-5 h-5 text-yellow-400 mb-2" />
                    <div className="text-2xl font-black text-white font-mono">19</div>
                    <span className="text-xs text-zinc-400 font-semibold">Self-Contained HTM Assets</span>
                </div>

                <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="text-2xl font-black text-white font-mono">ECDSA</div>
                    <span className="text-xs text-zinc-400 font-semibold">Voucher Verification</span>
                </div>
            </div>

            {/* Security Architecture Audit */}
            <div className="glass-panel rounded-3xl p-5 border border-zinc-800 space-y-3">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Sandbox & Security Architecture</h3>
                <div className="space-y-2 text-xs text-zinc-400">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                        <span>Iframe Sandbox Isolation</span>
                        <span className="font-mono text-emerald-400 font-bold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                        <span>Client Raw Score Trust</span>
                        <span className="font-mono text-red-400 font-bold">Disabled (Capped)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                        <span>Monad Escrow Replay Protection</span>
                        <span className="font-mono text-purple-400 font-bold">Nonce Tracked</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
