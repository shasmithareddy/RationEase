-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.get_next_token_number(p_shop_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(token_number), 0) + 1
  INTO next_number
  FROM public.tokens
  WHERE shop_id = p_shop_id
  AND DATE(created_at) = CURRENT_DATE;
  
  RETURN next_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;