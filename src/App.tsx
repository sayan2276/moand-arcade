import React, { useState, useEffect } from 'react';
import { GAMES_REGISTRY } from './data/gamesRegistry';
import { GameItem } from './types/game';
import { VerticalFeed } from './components/VerticalFeed';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { AIGameStudio } from './components/AIGameStudio';
import { AnalyticsView } from './components/AnalyticsView';
import { WalletClaimModal } from './components/WalletClaimModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { getCurrentProfile, UserProfile, fetchUserRealPoints } from './lib/supabaseClient';
import { Gamepad2, Search, Plus, User, BarChart3, Coins } from 'lucide-react';

export const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'ai' | 'profile' | 'stats'>('feed');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [unlockedCount, setUnlockedCount] = useState<number>(0);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);
    const [selectedGameForModal, setSelectedGameForModal] = useState<GameItem | null>(null);

    useEffect(() => {
        getCurrentProfile().then((user) => {
            setProfile(user);
            if (user) {
                fetchUserRealPoints(user.id).then((realPoints) => setTotalPoints(realPoints));
            }
        });
    }, []);

    const handleScoreUpdate = async (gameId: string, score: number) => {
        if (!profile) return;
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
            const response = await fetch(`${BACKEND_URL}/api/sessions/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile_id: profile.id,
                    game_id: gameId,
                    score: score
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.earned_points > 0) {
                    setTotalPoints((prev) => prev + data.earned_points);
                }
                if (data.unlocked_achievements?.length > 0) {
                    setUnlockedCount((prev) => prev + data.unlocked_achievements.length);
                }
            }
        } catch (err) {
            setTotalPoints((prev) => prev + 5);
        }
    };

    // Feature 2: 1-Minute Play Reward (+0.001 MON)
    const handleMinuteReward = async (gameId: string) => {
        if (!profile) return;
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
            const response = await fetch(`${BACKEND_URL}/api/sessions/reward-minute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile_id: profile.id,
                    game_id: gameId,
                    active_seconds: 60
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.reward_amount > 0) {
                    setTotalPoints((prev) => prev + data.reward_amount);
                }
            }
        } catch (err) {
            setTotalPoints((prev) => prev + 0.001);
        }
    };

    const handleOpenAchievements = (game: GameItem) => {
        setSelectedGameForModal(game);
        setIsClaimModalOpen(true);
    };

    return (
        <div className="w-screen h-screen bg-[#06060A] text-white flex flex-col justify-between overflow-hidden relative font-sans">

            {/* Top PC Brand Header Bar (Visible on Desktop >= 768px) */}
            <header className="hidden md:flex w-full h-16 bg-black/60 backdrop-blur-xl border-b border-white/10 px-8 items-center justify-between z-30 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg monad-glow">
                        M
                    </div>
                    <div>
                        <h1 className="text-base font-black text-white tracking-tight">Monad Arcade</h1>
                        <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
                            Swipe. Play. Compete on Monad.
                        </span>
                    </div>
                </div>

                {/* Top Desktop Navigation Links */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('feed')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'feed' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        🕹️ Arcade Feed
                    </button>
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'leaderboard' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        🏆 Discover & Ranks
                    </button>
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'ai' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        🪄 AI Studio
                    </button>
                </div>

                {/* Top Desktop Wallet Balance Button */}
                <button
                    onClick={() => setIsClaimModalOpen(true)}
                    className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold flex items-center gap-2 transition monad-glow"
                >
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span>{totalPoints.toFixed(3)} MON</span>
                </button>
            </header>

            {/* PWA Install Notification Prompt */}
            <PWAInstallPrompt />

            {/* Main View Area */}
            <main className="flex-1 w-full h-[calc(100vh-4.5rem)] overflow-hidden">
                {activeTab === 'feed' && (
                    <VerticalFeed
                        games={GAMES_REGISTRY}
                        onScoreUpdate={handleScoreUpdate}
                        onOpenAchievements={handleOpenAchievements}
                        onMinuteReward={handleMinuteReward}
                    />
                )}

                {activeTab === 'leaderboard' && (
                    <LeaderboardView userScore={totalPoints} />
                )}

                {activeTab === 'ai' && (
                    <AIGameStudio />
                )}

                {activeTab === 'profile' && profile && (
                    <ProfileView
                        profile={profile}
                        totalPoints={totalPoints}
                        unlockedAchievementsCount={unlockedCount}
                        onOpenClaimModal={() => setIsClaimModalOpen(true)}
                    />
                )}

                {activeTab === 'stats' && (
                    <AnalyticsView userPoints={totalPoints} />
                )}
            </main>

            {/* Claim Rewards Modal */}
            <WalletClaimModal
                totalPoints={totalPoints}
                isOpen={isClaimModalOpen}
                onClose={() => setIsClaimModalOpen(false)}
            />

            {/* Floating Pill Dock Navigation Bar */}
            <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
                <nav className="floating-dock rounded-full p-2 flex items-center gap-1 sm:gap-3 pointer-events-auto shadow-2xl">

                    <button
                        onClick={() => setActiveTab('feed')}
                        className={`dock-item p-3 rounded-full flex items-center justify-center ${activeTab === 'feed' ? 'dock-item-active' : 'text-zinc-400 hover:text-white'
                            }`}
                        title="Arcade Feed"
                    >
                        <Gamepad2 className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        className={`dock-item p-3 rounded-full flex items-center justify-center ${activeTab === 'leaderboard' ? 'dock-item-active' : 'text-zinc-400 hover:text-white'
                            }`}
                        title="Leaderboard & Discover"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`dock-item p-3 rounded-full flex items-center justify-center ${activeTab === 'ai' ? 'dock-item-active' : 'text-zinc-400 hover:text-white'
                            }`}
                        title="AI Game Studio"
                    >
                        <Plus className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`dock-item p-3 rounded-full flex items-center justify-center ${activeTab === 'stats' ? 'dock-item-active' : 'text-zinc-400 hover:text-white'
                            }`}
                        title="Platform Stats"
                    >
                        <BarChart3 className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`dock-item p-3 rounded-full flex items-center justify-center ${activeTab === 'profile' ? 'dock-item-active' : 'text-zinc-400 hover:text-white'
                            }`}
                        title="Player Profile"
                    >
                        <User className="w-5 h-5" />
                    </button>

                </nav>
            </div>

        </div>
    );
};
