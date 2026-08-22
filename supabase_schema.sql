-- Monad Arcade Supabase Database Schema with RLS Policies

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    avatar_url TEXT,
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Games Table
CREATE TABLE IF NOT EXISTS public.games (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    thumbnail TEXT,
    path TEXT NOT NULL,
    controls_info TEXT,
    difficulty TEXT,
    score_selector JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Game Sessions Table
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    game_id TEXT REFERENCES public.games(id) NOT NULL,
    score NUMERIC NOT NULL,
    active_seconds NUMERIC DEFAULT 0,
    rewarded BOOLEAN DEFAULT false,
    reward_amount NUMERIC DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    game_id TEXT REFERENCES public.games(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    score_threshold NUMERIC NOT NULL,
    reward_points NUMERIC NOT NULL
);

-- 5. Rewards Table
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id TEXT REFERENCES public.achievements(id),
    amount NUMERIC NOT NULL,
    nonce NUMERIC UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'claimed', 'EARNED', 'CLAIMABLE')),
    signature TEXT,
    tx_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Redemptions Table (Withdrawal History to Monad Testnet)
CREATE TABLE IF NOT EXISTS public.redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    wallet_address TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    transaction_hash TEXT NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Generated Games Table (AI Pipeline & 0.1 MON Publishing Fee)
CREATE TABLE IF NOT EXISTS public.generated_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt TEXT NOT NULL,
    title TEXT,
    code TEXT NOT NULL,
    publishing_fee NUMERIC DEFAULT 0.1,
    payment_transaction_hash TEXT,
    payment_status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'GENERATED', 'PREVIEW', 'PAYMENT_PENDING', 'PAID', 'PUBLISHED')),
    publication_status TEXT DEFAULT 'UNPUBLISHED' CHECK (publication_status IN ('UNPUBLISHED', 'PUBLISHED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_games ENABLE ROW LEVEL SECURITY;

-- RLS Policies Definition
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Games are viewable by everyone" ON public.games FOR SELECT USING (true);

CREATE POLICY "Game sessions viewable by everyone for leaderboard" ON public.game_sessions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own game sessions" ON public.game_sessions FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Achievements viewable by everyone" ON public.achievements FOR SELECT USING (true);

CREATE POLICY "Users can view their own rewards" ON public.rewards FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can view their own redemptions" ON public.redemptions FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Generated games viewable by everyone" ON public.generated_games FOR SELECT USING (true);
