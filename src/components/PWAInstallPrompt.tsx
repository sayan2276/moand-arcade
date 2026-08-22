import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState<boolean>(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto glass-panel border border-purple-500/40 rounded-2xl p-3 flex items-center justify-between shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                    <Smartphone className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-white">Install Monad Arcade App</h4>
                    <p className="text-[10px] text-zinc-400">Play full-screen & offline directly from home screen</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleInstallClick}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 shadow-md transition"
                >
                    <Download className="w-3.5 h-3.5" />
                    Install
                </button>
                <button
                    onClick={() => setShowPrompt(false)}
                    className="p-1 text-zinc-400 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
