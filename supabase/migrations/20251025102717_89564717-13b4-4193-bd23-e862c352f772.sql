-- Create app_role enum for user roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('shop_owner', 'customer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table with phone numbers
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Update shops table to add schedule
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS open_days TEXT[] DEFAULT '{}';
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS last_reset_date DATE DEFAULT CURRENT_DATE;

-- Update existing SHOP001 with better data
UPDATE public.shops 
SET 
  name = 'Tamil Nadu Ration Shop',
  name_tamil = 'தமிழ்நாடு நியாய விலை கடை',
  location = 'Main Street, Chennai',
  location_tamil = 'முதன்மை தெரு, சென்னை',
  is_active = true,
  open_days = ARRAY['Monday', 'Thursday'],
  last_reset_date = CURRENT_DATE
WHERE qr_code = 'SHOP001';

-- Function to reset daily tokens
CREATE OR REPLACE FUNCTION public.reset_daily_tokens()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.last_reset_date < CURRENT_DATE THEN
    DELETE FROM public.tokens 
    WHERE shop_id = NEW.id 
    AND status = 'completed' 
    AND DATE(created_at) < CURRENT_DATE - INTERVAL '7 days';
    
    NEW.last_reset_date = CURRENT_DATE;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-reset daily tokens
DROP TRIGGER IF EXISTS trigger_reset_daily_tokens ON public.shops;
CREATE TRIGGER trigger_reset_daily_tokens
  BEFORE UPDATE ON public.shops
  FOR EACH ROW
  EXECUTE FUNCTION public.reset_daily_tokens();