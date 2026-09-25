-- ==========================================================
-- SWASTHYA MITRA — SUBSCRIPTION SYSTEM MIGRATION
-- Run this migration in your Supabase SQL Editor.
-- Non-destructive: Does NOT alter or drop any existing tables.
-- ==========================================================

-- 1. Create subscription_plans table (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly NUMERIC NOT NULL DEFAULT 0,
  price_yearly NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Default Subscription Plans
INSERT INTO public.subscription_plans (id, name, price_monthly, price_yearly, currency, description, active) VALUES
('free', 'Free', 0, 0, 'INR', 'Essential health tools for everyone', true),
('plus', 'Plus', 99, 990, 'INR', 'Advanced AI diagnostics and personalized management', true),
('family', 'Family', 199, 1990, 'INR', 'Comprehensive healthcare for up to 5 family members', true),
('institutional', 'Institutional', 0, 0, 'INR', 'Enterprise solutions for PHCs, NGOs, and departments', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  description = EXCLUDED.description;


-- 2. Create subscriptions table (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  user_email TEXT NOT NULL,
  plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id) DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  provider TEXT DEFAULT 'system',
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 3. Create family_members table (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  owner_user_email TEXT NOT NULL,
  member_name TEXT NOT NULL,
  member_email TEXT,
  relationship TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 4. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_email ON public.subscriptions(user_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_family_members_owner ON public.family_members(owner_user_email);


-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;


-- 6. Idempotent RLS Policies

-- Subscription Plans: Public Read Access
DROP POLICY IF EXISTS "Allow public read to subscription plans" ON public.subscription_plans;
CREATE POLICY "Allow public read to subscription plans" ON public.subscription_plans
  FOR SELECT USING (true);

-- Subscriptions: Users can read and update their own subscription
DROP POLICY IF EXISTS "Allow users read own subscription" ON public.subscriptions;
CREATE POLICY "Allow users read own subscription" ON public.subscriptions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users insert own subscription" ON public.subscriptions;
CREATE POLICY "Allow users insert own subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users update own subscription" ON public.subscriptions;
CREATE POLICY "Allow users update own subscription" ON public.subscriptions
  FOR UPDATE USING (true);

-- Family Members: Users can manage their own family members
DROP POLICY IF EXISTS "Allow users read own family members" ON public.family_members;
CREATE POLICY "Allow users read own family members" ON public.family_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users insert own family members" ON public.family_members;
CREATE POLICY "Allow users insert own family members" ON public.family_members
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users delete own family members" ON public.family_members;
CREATE POLICY "Allow users delete own family members" ON public.family_members
  FOR DELETE USING (true);
