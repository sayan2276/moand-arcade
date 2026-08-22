import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Search, Crown, Sparkles, Gamepad2, ArrowRight, RefreshCw } from 'lucide-react';
import { GAMES_REGISTRY } from '../data/gamesRegistry';
import { fetchRealLeaderboard, RealLeaderboardEntry } from '../lib/supabaseClient';

export const LeaderboardView: React.FC<{ userScore: number }> = ({ userScore }) => {
    const [selectedGame, setSelectedGame] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [leaderboard, setLeaderboard] = useState<RealLeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadLeaderboardData = async () => {
        setLoading(true);
        const data = await fetchRealLeaderboard(selectedGame);
        setLeaderboard(data);
        setLoading(false);
    };

    useEffect(() => {
        loadLeaderboardData();
    }, [selectedGame]);

    const filteredEntries = leaderboard.filter((entry) => {
        return entry.username.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="w-full h-full max-w-6xl mx-auto p-4 md:p-6 flex flex-col pb-24 overflow-y-auto no-scrollbar">

            {/* Top Search Input Bar matching Reference Screenshot 4 ("What will you play next?") */}
            <div className="w-full max-w-2xl mx-auto mb-8">
                <div className="relative">
                    <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-3.5" />
                    <input
                        type="text"
                        placeholder="What will you play next?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/10 backdrop-blur-xl border border-white/15 rounded-full pl-12 pr-6 py-3.5 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition shadow-xl"
                    />
                </div>
            </div>

            {/* Featured "Most Popular Today" Horizontal Deck matching Screenshot 4 */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
                        Most Popular Today
                    </h2>
                    <button className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                        See all top games <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Responsive Horizontal Deck Carousel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {GAMES_REGISTRY.slice(0, 3).map((game) => (
                        <div
                            key={game.id}
                            className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-purple-500/50 transition flex flex-col justify-between h-64 relative overflow-hidden group shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition" />

                            <div className="flex items-start justify-between">
                                <span className="text-5xl p-2 bg-white/10 rounded-2xl">{game.thumbnail}</span>
                                <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 font-bold border border-purple-800/50">
                                    {game.category}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg font-black text-white mb-1 group-hover:text-purple-300 transition">
                                    {game.title}
                                </h3>
                                <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{game.description}</p>
                                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                                    <span>@{game.category.toLowerCase()}_creator</span>
                                    <span className="text-yellow-400 font-bold">Verified Arcade</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Real Supabase Leaderboard Rankings Section */}
            <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        Live Supabase Leaderboard Rankings
                    </h2>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={loadLeaderboardData}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 transition"
                            title="Refresh Leaderboard"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        {/* Game Category Chips */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                            <button
                                onClick={() => setSelectedGame('all')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${selectedGame === 'all'
                                        ? 'bg-white text-black shadow-md'
                                        : 'bg-white/5 text-zinc-400 hover:text-white'
                                    }`}
                            >
                                🔥 All Games
                            </button>
                            {GAMES_REGISTRY.slice(0, 4).map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => setSelectedGame(g.title)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${selectedGame === g.title
                                            ? 'bg-white text-black shadow-md'
                                            : 'bg-white/5 text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    {g.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Real Live Database Rankings List */}
                {loading ? (
                    <div className="glass-panel rounded-3xl p-10 text-center text-zinc-400 text-xs flex justify-center items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                        Fetching real session scores from Supabase...
                    </div>
                ) : filteredEntries.length > 0 ? (
                    <div className="space-y-3">
                        {filteredEntries.map((entry) => {
                            const getRankBadge = (rank: number) => {
                                if (rank === 1) return <span className="text-yellow-400 font-bold text-base">🥇 #1</span>;
                                if (rank === 2) return <span className="text-zinc-300 font-bold text-base">🥈 #2</span>;
                                if (rank === 3) return <span className="text-amber-600 font-bold text-base">🥉 #3</span>;
                                return <span className="text-zinc-500 font-bold text-xs">#{rank}</span>;
                            };

                            return (
                                <div
                                    key={entry.rank}
                                    className={`glass-panel rounded-2xl p-4 flex items-center justify-between transition hover:border-purple-500/40 ${entry.rank === 1 ? 'border-yellow-500/40 bg-yellow-950/10' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 text-center">{getRankBadge(entry.rank)}</div>
                                        <img
                                            src={entry.avatar}
                                            alt={entry.username}
                                            className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 shadow-md"
                                        />
                                        <div>
                                            <h3 className="text-sm font-bold text-white leading-tight">{entry.username}</h3>
                                            <span className="text-xs text-purple-400 font-semibold">{entry.gameTitle}</span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-base font-black text-white font-mono">{entry.score.toLocaleString()}</div>
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase">{entry.scoreUnit}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-panel rounded-3xl p-10 text-center border border-white/10 flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                            <Crown className="w-8 h-8" />
                        </div>
                        <h3 className="text-sm font-bold text-white">No real game sessions recorded yet!</h3>
                        <p className="text-xs text-zinc-400 max-w-md">
                            Play any of the 19 arcade games in the feed. When your game session finishes, your real high score will be posted here live to Supabase!
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
};
