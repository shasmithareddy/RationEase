-- Fix 1: Create security definer functions to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.user_owns_shop(_user_id uuid, _shop_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.shops
    WHERE id = _shop_id 
    AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.user_has_shop_access(_user_id uuid, _shop_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.shop_users
    WHERE shop_id = _shop_id 
    AND user_id = _user_id
  );
$$;

-- Fix 2: Update RLS policies to use security definer functions
DROP POLICY IF EXISTS "Shop owners can view their shop_users" ON public.shop_users;
CREATE POLICY "Shop owners can view their shop_users" 
ON public.shop_users 
FOR SELECT 
USING (
  (user_id = auth.uid()) OR 
  public.user_owns_shop(auth.uid(), shop_id)
);

DROP POLICY IF EXISTS "Shop owners can update their shops" ON public.shops;
CREATE POLICY "Shop owners can update their shops" 
ON public.shops 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  public.user_has_shop_access(auth.uid(), id)
);

DROP POLICY IF EXISTS "Users can view their own shops" ON public.shops;
CREATE POLICY "Users can view their own shops" 
ON public.shops 
FOR SELECT 
USING (
  (user_id = auth.uid()) OR 
  public.user_has_shop_access(auth.uid(), id)
);

-- Fix 3: Clear demo tokens to prevent duplicate key errors
DELETE FROM public.tokens WHERE shop_id = '2c61f3ab-f3ac-485a-8a4c-f829401a2bee';