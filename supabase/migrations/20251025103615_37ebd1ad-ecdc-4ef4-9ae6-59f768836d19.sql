-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Insert 20 demo tokens for SHOP001
INSERT INTO public.tokens (shop_id, token_number, customer_name, customer_phone, status, created_at)
SELECT 
  '2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid,
  n,
  'Customer ' || n,
  '+9186680122' || LPAD(n::text, 2, '0'),
  CASE WHEN n <= 5 THEN 'completed' ELSE 'waiting' END,
  NOW() - (INTERVAL '1 hour' * (20 - n))
FROM generate_series(1, 20) AS n
ON CONFLICT DO NOTHING;