-- Monad Arcade Migration Script
-- Run this script in Supabase SQL Editor to update your existing database

-- 1. Add redemptions table for MON withdrawals
CREATE TABLE IF NOT EXISTS public.redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    wallet_address TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    transaction_hash TEXT NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own redemptions'
    ) THEN
        CREATE POLICY "Users can view their own redemptions" ON public.redemptions FOR SELECT USING (auth.uid() = profile_id);
    END IF;
END $$;

-- 2. Add gameplay tracking columns to game_sessions
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS active_seconds NUMERIC DEFAULT 0;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS rewarded BOOLEAN DEFAULT false;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS reward_amount NUMERIC DEFAULT 0;

-- 3. Add publishing columns to generated_games
ALTER TABLE public.generated_games ADD COLUMN IF NOT EXISTS publishing_fee NUMERIC DEFAULT 0.1;
ALTER TABLE public.generated_games ADD COLUMN IF NOT EXISTS payment_transaction_hash TEXT;
ALTER TABLE public.generated_games ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'DRAFT';
ALTER TABLE public.generated_games ADD COLUMN IF NOT EXISTS publication_status TEXT DEFAULT 'UNPUBLISHED';
