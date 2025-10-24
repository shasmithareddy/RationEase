-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Shop owners can view their shops" ON public.shops;
DROP POLICY IF EXISTS "Anyone can view active shops by QR code" ON public.shops;
DROP POLICY IF EXISTS "Shop owners can view their tokens" ON public.tokens;

-- Create simpler, working policies for shops
CREATE POLICY "Users can view their own shops"
  ON public.shops FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    id IN (
      SELECT shop_id FROM public.shop_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view active shops"
  ON public.shops FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create simpler policies for tokens
CREATE POLICY "Users can view tokens for their shops"
  ON public.tokens FOR SELECT
  TO authenticated
  USING (
    shop_id IN (
      SELECT id FROM public.shops 
      WHERE user_id = auth.uid() OR id IN (
        SELECT shop_id FROM public.shop_users WHERE user_id = auth.uid()
      )
    )
  );

-- Policy for shop_users
CREATE POLICY "Users can view their shop associations"
  ON public.shop_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());