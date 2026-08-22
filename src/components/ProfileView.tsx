import React, { useState } from 'react';
import { UserProfile, signOutUser } from '../lib/supabaseClient';
import { User, Wallet, Trophy, Award, Sparkles, LogOut, Bell, Settings, Edit3, Heart, Bookmark, Gamepad2, Coins } from 'lucide-react';

import { GAMES_REGISTRY } from '../data/gamesRegistry';

interface ProfileViewProps {
    profile: UserProfile;
    totalPoints: number;
    unlockedAchievementsCount: number;
    onOpenClaimModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
    profile,
    totalPoints,
    unlockedAchievementsCount,
    onOpenClaimModal
}) => {
    const [activeTab, setActiveTab] = useState<'my_games' | 'saved'>('my_games');

    return (
        <div className="w-full h-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col pb-24 overflow-y-auto no-scrollbar">

            {/* Top Header Bar */}
            <div className="w-full flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition">
                        <Bell className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                <h1 className="text-xl font-black text-white tracking-tight">Profile</h1>

                {/* Top Wallet Balance Pill */}
                <button
                    onClick={onOpenClaimModal}
                    className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 text-white font-mono font-bold text-sm flex items-center gap-2 transition"
                >
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span>{totalPoints} MON</span>
                </button>
            </div>

            {/* Main Responsive Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                {/* Left Column: Avatar & User Handle Card */}
                <div className="md:col-span-5 flex flex-col items-center glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden text-center shadow-2xl">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl -z-10" />

                    {/* Avatar Container */}
                    <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-3xl bg-purple-950 border-4 border-white p-2 shadow-2xl flex items-center justify-center overflow-hidden">
                            <img
                                src={profile.avatar_url}
                                alt={profile.username}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 rounded-full bg-white text-black shadow-lg hover:scale-110 transition">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-white mb-1">{profile.username}</h2>
                    <span className="text-xs text-purple-400 font-mono mb-6">ID: {profile.id}</span>

                    {/* Real Profile Stats Box */}
                    <div className="w-full grid grid-cols-3 gap-2 bg-white/5 rounded-2xl p-3 border border-white/10 mb-6">
                        <div className="text-center">
                            <div className="text-lg font-black text-white font-mono">{totalPoints}</div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">MON Earned</span>
                        </div>
                        <div className="text-center border-x border-white/10">
                            <div className="text-lg font-black text-yellow-400 font-mono">{unlockedAchievementsCount}</div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Badges</span>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-black text-purple-400 font-mono">19</div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Games</span>
                        </div>
                    </div>

                    <button
                        onClick={onOpenClaimModal}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg monad-glow transition"
                    >
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        Claim Verified MON Rewards
                    </button>
                </div>

                {/* Right Column: Segmented Controls & Games Showcase */}
                <div className="md:col-span-7 flex flex-col gap-4">

                    <div className="w-full bg-white/5 p-1 rounded-2xl border border-white/10 flex items-center">
                        <button
                            onClick={() => setActiveTab('my_games')}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${activeTab === 'my_games'
                                ? 'bg-white text-black shadow-md'
                                : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            Available Games
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${activeTab === 'saved'
                                ? 'bg-white text-black shadow-md'
                                : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            Saved
                        </button>
                    </div>

                    {activeTab === 'my_games' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {GAMES_REGISTRY.slice(0, 6).map((game) => (
                                <div
                                    key={game.id}
                                    className="glass-panel rounded-3xl p-4 border border-white/10 hover:border-purple-500/40 flex items-center gap-3 transition"
                                >
                                    <span className="text-3xl p-2 bg-white/10 rounded-2xl">{game.thumbnail}</span>
                                    <div className="overflow-hidden">
                                        <h4 className="text-sm font-bold text-white truncate">{game.title}</h4>
                                        <span className="text-xs text-purple-400 font-semibold">{game.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel rounded-3xl p-10 text-center border border-white/10 flex flex-col items-center justify-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-zinc-400">
                                <Bookmark className="w-8 h-8" />
                            </div>
                            <h3 className="text-sm font-bold text-white">Your saved games will live here.</h3>
                            <p className="text-xs text-zinc-400">Bookmark games while browsing the feed to quickly return later.</p>
                        </div>
                    )}

                    {/* Account Session Controls */}
                    <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3 mt-2">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Guest Session</h4>
                        <button
                            onClick={signOutUser}
                            className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-700 transition"
                        >
                            <LogOut className="w-4 h-4 text-purple-400" />
                            Reset Guest Profile & Session
                        </button>
                    </div>


                </div>

            </div>
        </div>
    );
};
