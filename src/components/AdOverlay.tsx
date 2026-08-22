import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Sparkles, ExternalLink } from 'lucide-react';

interface AdOverlayProps {
    adVideoSrc: string;
    onSkip: () => void;
}

export const AdOverlay: React.FC<AdOverlayProps> = ({ adVideoSrc, onSkip }) => {
    const [countdown, setCountdown] = useState<number>(5);
    const [isMuted, setIsMuted] = useState<boolean>(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8 animate-fade-in">

            {/* Top Ad Header Bar */}
            <div className="w-full max-w-4xl mx-auto flex items-center justify-between z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Sponsored Arcade Interstitial</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* 5-Second Unskippable Countdown Button */}
                    <button
                        onClick={countdown === 0 ? onSkip : undefined}
                        disabled={countdown > 0}
                        className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition shadow-xl ${countdown > 0
                                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed opacity-75'
                                : 'bg-white text-black hover:bg-purple-400 hover:text-white monad-glow active:scale-95'
                            }`}
                    >
                        <SkipForward className="w-4 h-4" />
                        {countdown > 0 ? `Skip in ${countdown}s` : 'SKIP AD'}
                    </button>
                </div>
            </div>

            {/* Main Video Viewport */}
            <div className="w-full max-w-4xl mx-auto flex-1 my-4 relative rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl flex items-center justify-center">
                <video
                    src={adVideoSrc}
                    autoPlay
                    playsInline
                    loop
                    muted={isMuted}
                    className="w-full h-full object-cover"
                />

                {/* Bottom Video Badge */}
                <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs flex items-center gap-3">
                    <div>
                        <h4 className="font-bold">Monad Ecosystem Showcase</h4>
                        <p className="text-[10px] text-zinc-400">Discover next-gen high-performance EVM dApps</p>
                    </div>
                    <a
                        href="https://monad.xyz"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
                    >
                        Explore <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>

            {/* Footer Info */}
            <div className="w-full max-w-4xl mx-auto text-center text-[11px] text-zinc-500 font-mono">
                Ad will auto-continue after completion • Monad Arcade Hackathon 2026
            </div>

        </div>
    );
};
