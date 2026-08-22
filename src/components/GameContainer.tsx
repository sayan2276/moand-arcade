import React, { useEffect, useRef, useState } from 'react';
import { GameItem, GameCompletedMessage } from '../types/game';
import { Volume2, VolumeX, Maximize2, RotateCcw, Award, Clock } from 'lucide-react';

interface GameContainerProps {
    game: GameItem;
    isActive: boolean;
    isAdjacent: boolean;
    onScoreUpdate: (gameId: string, score: number) => void;
    onMinuteCompleted?: (gameId: string) => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
    game,
    isActive,
    isAdjacent,
    onScoreUpdate,
    onMinuteCompleted
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
    const [activeSeconds, setActiveSeconds] = useState<number>(0);
    const [hasAwardedMinute, setHasAwardedMinute] = useState<boolean>(false);

    // Unmount memory cleanup effect (Feature 1)
    useEffect(() => {
        return () => {
            if (iframeRef.current) {
                try {
                    iframeRef.current.src = 'about:blank';
                } catch (e) { }
            }
        };
    }, []);

    // 1-Minute Gameplay Timer (Feature 2)
    useEffect(() => {
        if (!isActive || hasAwardedMinute) return;

        const timer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                setActiveSeconds((prev) => {
                    const nextVal = prev + 1;
                    if (nextVal >= 60 && !hasAwardedMinute) {
                        setHasAwardedMinute(true);
                        if (onMinuteCompleted) onMinuteCompleted(game.id);
                    }
                    return nextVal;
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, hasAwardedMinute, game.id, onMinuteCompleted]);

    // Helper to throttle score updates
    const handleScoreFound = (score: number) => {
        if (isNaN(score) || score <= 0) return;
        const cleanScore = Math.floor(score);
        setCurrentScore(cleanScore);

        const now = Date.now();
        if (now - lastSubmitTime > 1000) {
            setLastSubmitTime(now);
            onScoreUpdate(game.id, cleanScore);
        }
    };

    // Primary postMessage Event Listener
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            try {
                const data = event.data as GameCompletedMessage;
                if (data && data.type === 'GAME_COMPLETED' && data.gameId === game.id) {
                    handleScoreFound(data.score);
                }
            } catch (err) { }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [game.id]);

    // Fallback Score Sniffing Strategy
    useEffect(() => {
        if (!isActive || !iframeRef.current) return;

        const iframeNode = iframeRef.current;
        let pollInterval: NodeJS.Timeout | null = null;

        const attachFallbackInspector = () => {
            try {
                const innerWin = iframeNode.contentWindow as any;
                if (!innerWin) return;

                if (game.scoreSelector.type === 'localStorage' && game.scoreSelector.key) {
                    const originalSetItem = innerWin.localStorage?.setItem;
                    if (originalSetItem) {
                        innerWin.localStorage.setItem = function (key: string, value: string) {
                            originalSetItem.apply(this, [key, value]);
                            if (key === game.scoreSelector.key) {
                                try {
                                    if (game.scoreSelector.path) {
                                        const parsed = JSON.parse(value);
                                        const val = parseFloat(parsed[game.scoreSelector.path]);
                                        if (!isNaN(val)) handleScoreFound(val);
                                    } else {
                                        const val = parseFloat(value);
                                        if (!isNaN(val)) handleScoreFound(val);
                                    }
                                } catch (e) { }
                            }
                        };
                    }
                }

                if (game.scoreSelector.type === 'globalVar' && game.scoreSelector.varName) {
                    pollInterval = setInterval(() => {
                        try {
                            const val = innerWin[game.scoreSelector.varName!];
                            if (typeof val === 'number' && !isNaN(val)) {
                                handleScoreFound(val);
                            }
                        } catch (e) { }
                    }, 800);
                }
            } catch (err) {
                console.warn(`[Monad Arcade] Could not attach inspector to ${game.id}`, err);
            }
        };

        iframeNode.addEventListener('load', attachFallbackInspector);
        if (iframeNode.contentDocument?.readyState === 'complete') {
            attachFallbackInspector();
        }

        return () => {
            iframeNode.removeEventListener('load', attachFallbackInspector);
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [isActive, game]);

    const handleReload = () => {
        if (iframeRef.current) {
            iframeRef.current.src = game.path;
        }
    };

    // Render Placeholder if neither active nor adjacent (Feature 1 memory optimization)
    if (!isActive && !isAdjacent) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 p-6 rounded-2xl border border-zinc-900">
                <div className="text-6xl mb-4 opacity-50 animate-pulse">{game.thumbnail}</div>
                <h3 className="text-lg font-bold text-zinc-400">{game.title}</h3>
                <p className="text-xs text-zinc-600 mt-1">Swipe to load game...</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden border border-purple-950/40 shadow-2xl flex flex-col">
            {/* Game HUD Overlay */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                {/* Current Live Score Tag */}
                <div className="pointer-events-auto bg-black/80 backdrop-blur-md border border-purple-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-fade-in">
                    <Award className="w-4 h-4 text-purple-400 animate-bounce" />
                    <span className="text-xs text-zinc-400 uppercase font-semibold">Score:</span>
                    <span className="text-sm font-black text-white font-mono">{currentScore.toLocaleString()}</span>
                    <span className="text-[10px] text-purple-400 font-bold">{game.scoreUnit}</span>
                </div>

                {/* Action Quick Controls & Active Play Timer */}
                <div className="pointer-events-auto flex items-center gap-2">
                    {isActive && (
                        <div className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[11px] text-zinc-300 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-purple-400" />
                            <span>{activeSeconds}s / 60s</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 bg-black/70 backdrop-blur-md border border-zinc-800 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleReload}
                        className="p-2 bg-black/70 backdrop-blur-md border border-zinc-800 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                        title="Restart Game"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Sandboxed Game Iframe */}
            <div className="relative flex-1 w-full h-full bg-zinc-950">
                <iframe
                    ref={iframeRef}
                    src={game.path}
                    title={game.title}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    className={`w-full h-full border-none transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40 pointer-events-none'
                        }`}
                />
            </div>
        </div>
    );
};
