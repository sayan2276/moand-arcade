import { createClient } from '@supabase/supabase-js';

// Read env variables or fallback gracefully
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://suoeawdljtgjusrfsanj.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_eGLaHRlrrFAAaaDMfnDlFg_kNmH5ahe';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    }
});

export interface UserProfile {
    id: string;
    username: string;
    avatar_url?: string;
    wallet_address?: string;
    created_at?: string;
}

export interface RealLeaderboardEntry {
    rank: number;
    username: string;
    avatar: string;
    gameTitle: string;
    score: number;
    scoreUnit: string;
}

// LocalStorage key for anonymous player profile
const LOCAL_PROFILE_KEY = 'monad_arcade_guest_profile';

// Helper to generate valid UUID v4 for guest profile compatibility with Supabase Postgres UUID columns
const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

// Create or retrieve persistent guest profile (No forced login required!)
export const getCurrentProfile = async (): Promise<UserProfile> => {
    const savedGuest = localStorage.getItem(LOCAL_PROFILE_KEY);
    let profile: UserProfile;

    if (savedGuest) {
        try {
            const parsed = JSON.parse(savedGuest);
            // Ensure ID is a valid UUID
            if (parsed && parsed.id && parsed.id.length === 36 && parsed.id.includes('-')) {
                profile = parsed;
            } else {
                profile = createFreshGuest();
            }
        } catch (e) {
            profile = createFreshGuest();
        }
    } else {
        profile = createFreshGuest();
    }

    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));

    // Automatically register/sync guest profile into Supabase `profiles` table!
    try {
        await supabase.from('profiles').upsert({
            id: profile.id,
            username: profile.username,
            avatar_url: profile.avatar_url,
            wallet_address: profile.wallet_address || ''
        });
    } catch (err) {
        console.warn('[Supabase] Guest profile auto-sync warning:', err);
    }

    return profile;
};

const createFreshGuest = (): UserProfile => {
    const guestId = generateUUID();
    const shortCode = guestId.substring(0, 4);
    return {
        id: guestId,
        username: `MonadGamer_${shortCode}`,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${guestId}`,
        wallet_address: ''
    };
};

// Fetch real leaderboard rankings from Supabase DB `game_sessions` table
export const fetchRealLeaderboard = async (gameFilter?: string): Promise<RealLeaderboardEntry[]> => {
    try {
        let query = supabase
            .from('game_sessions')
            .select(`
                score,
                game_id,
                profiles (
                    username,
                    avatar_url
                )
            `)
            .order('score', { ascending: false })
            .limit(20);

        if (gameFilter && gameFilter !== 'all') {
            query = query.eq('game_id', gameFilter.toLowerCase().replace(/\s+/g, ''));
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            return [];
        }

        return data.map((item: any, index: number) => ({
            rank: index + 1,
            username: item.profiles?.username || `Gamer_${item.game_id}`,
            avatar: item.profiles?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${index}`,
            gameTitle: item.game_id,
            score: item.score || 0,
            scoreUnit: 'pts'
        }));
    } catch (err) {
        console.warn('Could not fetch real leaderboard, DB table empty or connecting:', err);
        return [];
    }
};

// Fetch real accumulated user MON rewards balance from DB
export const fetchUserRealPoints = async (profileId: string): Promise<number> => {
    try {
        const { data, error } = await supabase
            .from('rewards')
            .select('amount')
            .eq('profile_id', profileId);

        if (error || !data) return 0;

        const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
        return total;
    } catch (err) {
        return 0;
    }
};

// Sign out / Reset guest session
export const signOutUser = async () => {
    localStorage.removeItem(LOCAL_PROFILE_KEY);
    window.location.reload();
};
