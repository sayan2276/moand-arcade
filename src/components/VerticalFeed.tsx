import React, { useState, useEffect, useRef } from 'react';
import { GameItem } from '../types/game';
import { GameContainer } from './GameContainer';
import { AdOverlay } from './AdOverlay';
import { ChevronUp, ChevronDown, Trophy, Sparkles, Share2, Info, Flame, Gamepad2, Heart, MessageSquare, Bookmark, Send, Clock, Crown, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerticalFeedProps {
    games: GameItem[];
    onScoreUpdate: (gameId: string, score: number) => void;
    onOpenAchievements: (game: GameItem) => void;
    onMinuteReward?: (gameId: string) => void;
}

export const VerticalFeed: React.FC<VerticalFeedProps> = ({
    games,
    onScoreUpdate,
    onOpenAchievements,
    onMinuteReward
}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [gamesPlayedCount, setGamesPlayedCount] = useState<number>(0);
    const [showAdOverlay, setShowAdOverlay] = useState<boolean>(false);
    const [adRotationIndex, setAdRotationIndex] = useState<number>(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const [likesCount, setLikesCount] = useState<number>(12);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [timerSeconds, setTimerSeconds] = useState<number>(120);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef<number>(0);

    const currentGame = games[activeIndex];

    // Match countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 120));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTimer = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const checkAdTrigger = (newIndex: number) => {
        const newCount = gamesPlayedCount + 1;
        setGamesPlayedCount(newCount);

        // Feature 5: Show ad after every 3 games played
        if (newCount > 0 && newCount % 3 === 0) {
            setShowAdOverlay(true);
            setAdRotationIndex((prev) => prev + 1);
        }
    };

    const goToNext = () => {
        if (activeIndex < games.length - 1) {
            const nextIdx = activeIndex + 1;
            setActiveIndex(nextIdx);
            checkAdTrigger(nextIdx);
        }
    };

    const goToPrev = () => {
        if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'PageDown' || (e.ctrlKey && e.key === 'ArrowDown')) {
                goToNext();
            } else if (e.key === 'PageUp' || (e.ctrlKey && e.key === 'ArrowUp')) {
                goToPrev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, games.length, gamesPlayedCount]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY.current - touchEndY;
        if (diffY > 60) goToNext();
        else if (diffY < -60) goToPrev();
    };

    const handleScoreChange = (gameId: string, score: number) => {
        onScoreUpdate(gameId, score);
        if (score >= 100 && score % 100 === 0) {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
        }
    };

    // Feature 2: 1-Minute Play Reward Callback
    const handleMinuteCompleted = (gameId: string) => {
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });
        setToastMessage('🎮 1 minute completed! +0.001 MON earned');
        setTimeout(() => setToastMessage(null), 4000);
        if (onMinuteReward) onMinuteReward(gameId);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Playing ${currentGame.title} on Monad Arcade`,
                text: `Play ${currentGame.title} on Monad Arcade!`,
                url: window.location.href
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const toggleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    };

    const currentAdSrc = adRotationIndex % 2 === 0 ? '/ads/ad1.mp4' : '/ads/ad2.mp4';

    return (
        <div className="w-full h-full flex flex-col justify-between overflow-hidden relative">

            {/* Feature 5: Interstitial Ad Overlay */}
            {showAdOverlay && (
                <AdOverlay
                    adVideoSrc={currentAdSrc}
                    onSkip={() => setShowAdOverlay(false)}
                />
            )}

            {/* Feature 2: 1-Minute Play Reward Toast Notification */}
            {toastMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 border border-white/20 text-white font-bold text-xs shadow-2xl monad-glow flex items-center gap-2 animate-bounce">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Mobile + Desktop Container Grid */}
            <div className="w-full max-w-7xl mx-auto h-[calc(100vh-4.5rem)] grid grid-cols-1 md:grid-cols-12 gap-6 p-2 md:p-4">

                {/* Main Feed Iframe Viewport (Mobile: 12-col, Desktop: 8-col) */}
                <div className="md:col-span-8 h-full relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black/90 shadow-2xl">

                    {/* Top Timer & Real Session Status */}
                    <div className="absolute top-3 left-3 right-3 z-30 flex items-start justify-between pointer-events-none">
                        <div className="mx-auto pointer-events-auto px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/15 text-white font-mono text-sm font-bold shadow-2xl flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-purple-400" />
                            {formatTimer(timerSeconds)}
                        </div>

                        <div className="absolute right-0 top-0 pointer-events-auto flex flex-col gap-1 items-end bg-black/60 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-[11px] font-mono">
                            <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                SESSION: <span className="text-yellow-400 font-bold">Active</span>
                            </div>
                            <div className="text-[10px] text-zinc-400">
                                Monad Testnet Live
                            </div>
                        </div>
                    </div>

                    {/* Game Viewport Container with Memory Windowing (Feature 1) */}
                    <div
                        ref={containerRef}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        className="relative w-full h-full overflow-hidden"
                    >
                        {games.map((game, index) => {
                            const isActive = index === activeIndex;
                            const isNextAdjacent = index === activeIndex + 1;
                            const isPrevAdjacent = index === activeIndex - 1;

                            // Feature 1 Memory Optimization: ONLY mount loaded iframe if current or next/prev adjacent
                            if (!isActive && !isNextAdjacent && !isPrevAdjacent) return null;

                            return (
                                <div
                                    key={game.id}
                                    className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-out ${index === activeIndex
                                            ? 'translate-y-0 opacity-100 z-10'
                                            : index < activeIndex
                                                ? '-translate-y-full opacity-0 z-0'
                                                : 'translate-y-full opacity-0 z-0'
                                        }`}
                                >
                                    <GameContainer
                                        game={game}
                                        isActive={isActive}
                                        isAdjacent={isNextAdjacent || isPrevAdjacent}
                                        onScoreUpdate={handleScoreChange}
                                        onMinuteCompleted={handleMinuteCompleted}
                                    />
                                </div>
                            );
                        })}

                        {/* Quick Actions Side Column */}
                        <div className="absolute right-3 bottom-24 z-30 flex flex-col gap-3">
                            <button
                                onClick={goToPrev}
                                disabled={activeIndex === 0}
                                className={`p-3 rounded-full bg-black/60 backdrop-blur-xl text-white border border-white/15 transition ${activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95 hover:border-purple-500'
                                    }`}
                                title="Previous Game"
                            >
                                <ChevronUp className="w-5 h-5 text-purple-300" />
                            </button>

                            <button
                                onClick={goToNext}
                                disabled={activeIndex === games.length - 1}
                                className={`p-3 rounded-full bg-black/60 backdrop-blur-xl text-white border border-white/15 transition ${activeIndex === games.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95 monad-glow'
                                    }`}
                                title="Next Game"
                            >
                                <ChevronDown className="w-5 h-5 text-purple-300" />
                            </button>

                            <button
                                onClick={() => onOpenAchievements(currentGame)}
                                className="p-3 rounded-full bg-black/60 backdrop-blur-xl text-yellow-400 border border-yellow-500/30 hover:scale-110 transition"
                                title="Claim Rewards"
                            >
                                <Trophy className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleShare}
                                className="p-3 rounded-full bg-black/60 backdrop-blur-xl text-cyan-400 border border-cyan-500/30 hover:scale-110 transition"
                                title="Share"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Left Floating Metadata */}
                    <div className="absolute bottom-3 left-3 right-16 z-30 p-3.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 text-white flex items-center justify-between shadow-2xl">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl p-1 bg-white/10 rounded-xl">{currentGame.thumbnail}</span>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-bold text-white">{currentGame.title}</h2>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/50">
                                        Arcade
                                    </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 font-mono">HTML5 Sandboxed</p>

                                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-300">
                                    <button onClick={toggleLike} className="flex items-center gap-1 hover:text-red-400 transition">
                                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                                        <span>{likesCount}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onOpenAchievements(currentGame)}
                            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition shadow-lg shrink-0 flex items-center gap-1.5"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            Rewards
                        </button>
                    </div>
                </div>

                {/* Desktop PC Sidebar Panel (Visible on Widescreen >= 768px) */}
                <div className="hidden md:flex md:col-span-4 flex-col gap-4 h-full overflow-y-auto no-scrollbar">

                    <div className="glass-panel rounded-3xl p-5 border border-purple-500/30">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-4xl p-2 rounded-2xl bg-purple-950/80 border border-purple-500/40">
                                {currentGame.thumbnail}
                            </span>
                            <div>
                                <h2 className="text-xl font-bold text-white">{currentGame.title}</h2>
                                <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                                    {currentGame.category} Arcade
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed mb-4">{currentGame.description}</p>

                        <div className="p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800 flex items-center gap-2">
                            <Gamepad2 className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="text-xs text-zinc-300">{currentGame.controls}</span>
                        </div>
                    </div>

                    <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-yellow-400" />
                                    Live Session Status
                                </h3>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                                    Supabase Live
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-2">
                                <div className="flex justify-between items-center text-zinc-300">
                                    <span>1-Min Play Reward:</span>
                                    <span className="text-emerald-400 font-bold">+0.001 MON</span>
                                </div>
                                <div className="flex justify-between items-center text-zinc-300">
                                    <span>Ad Interstitial:</span>
                                    <span className="text-purple-400 font-bold">Every 3 Games</span>
                                </div>
                                <p className="text-[11px] text-zinc-400 pt-2 border-t border-white/10">
                                    Play continuously for 60 seconds to earn +0.001 MON off-chain rewards. Claim to wallet once balance reaches 1 MON!
                                </p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-800">
                            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Up Next</h4>
                            {games[activeIndex + 1] && (
                                <div
                                    onClick={goToNext}
                                    className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between cursor-pointer transition"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-xl">{games[activeIndex + 1].thumbnail}</span>
                                        <span className="text-xs font-bold text-white">{games[activeIndex + 1].title}</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-purple-400" />
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};
