-- Ensure SHOP001 exists with proper data
INSERT INTO public.shops (id, user_id, name, name_tamil, location, location_tamil, qr_code, is_active, open_days)
VALUES (
  '2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Tamil Nadu Ration Shop',
  'தமிழ்நாடு நியாய விலைக் கடை',
  'Chennai, Tamil Nadu',
  'சென்னை, தமிழ்நாடு',
  'SHOP001',
  true,
  ARRAY['Monday', 'Thursday']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_tamil = EXCLUDED.name_tamil,
  location = EXCLUDED.location,
  location_tamil = EXCLUDED.location_tamil,
  qr_code = EXCLUDED.qr_code,
  is_active = EXCLUDED.is_active,
  open_days = EXCLUDED.open_days;

-- Clear existing demo tokens
DELETE FROM public.tokens WHERE shop_id = '2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid;

-- Insert 25 demo customers with varied statuses
INSERT INTO public.tokens (shop_id, token_number, customer_name, customer_phone, status, created_at, completed_at)
VALUES
  -- Completed tokens (1-8)
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 1, 'Raja Kumar', '+918668012201', 'completed', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 45 minutes'),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 2, 'Lakshmi Devi', '+918668012202', 'completed', NOW() - INTERVAL '2 hours 50 minutes', NOW() - INTERVAL '2 hours 35 minutes'),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 3, 'Murugan S', '+918668012203', 'completed', NOW() - INTERVAL '2 hours 40 minutes', NOW() - INTERVAL '2 hours 25 minutes'),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 4, 'Priya Rajan', '+918668012204', 'completed', NOW() - INTERVAL '2 hours 30 minutes', NOW() - INTERVAL '2 hours 15 minutes'),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 5, 'Selvam P', '+918668012205', 'completed', NOW() - INTERVAL '2 hours 20 minutes', NOW() - INTERVAL '2 hours 5 minutes'),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 6, 'Anitha K', '+918668012206', 'completed', NOW() - INTERVAL '2 hours 10 minutes', NOW() - INTERVAL '1 hour 55 minutes'),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 7, 'Karthik M', '+918668012207', 'completed', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 45 minutes'),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 8, 'Deepa S', '+918668012208', 'completed', NOW() - INTERVAL '1 hour 50 minutes', NOW() - INTERVAL '1 hour 35 minutes'),
  
  -- Waiting tokens (9-25)
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 9, 'Ramesh N', '+918668012209', 'waiting', NOW() - INTERVAL '1 hour 30 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 10, 'Kavitha R', '+918668012210', 'waiting', NOW() - INTERVAL '1 hour 25 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 11, 'Ganesh V', '+918668012211', 'waiting', NOW() - INTERVAL '1 hour 20 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 12, 'Meena T', '+918668012212', 'waiting', NOW() - INTERVAL '1 hour 15 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 13, 'Suresh B', '+918668012213', 'waiting', NOW() - INTERVAL '1 hour 10 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 14, 'Radha M', '+918668012214', 'waiting', NOW() - INTERVAL '1 hour 5 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 15, 'Vignesh K', '+918668012215', 'waiting', NOW() - INTERVAL '1 hour', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 16, 'Shalini P', '+918668012216', 'waiting', NOW() - INTERVAL '55 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 17, 'Arun D', '+918668012217', 'waiting', NOW() - INTERVAL '50 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 18, 'Divya S', '+918668012218', 'waiting', NOW() - INTERVAL '45 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 19, 'Prakash R', '+918668012219', 'waiting', NOW() - INTERVAL '40 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 20, 'Sangeetha V', '+918668012220', 'waiting', NOW() - INTERVAL '35 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 21, 'Bala G', '+918668012221', 'waiting', NOW() - INTERVAL '30 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 22, 'Vasanthi K', '+918668012222', 'waiting', NOW() - INTERVAL '25 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 23, 'Senthil A', '+918668012223', 'waiting', NOW() - INTERVAL '20 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 24, 'Malathi B', '+918668012224', 'waiting', NOW() - INTERVAL '15 minutes', NULL),
  ('2c61f3ab-f3ac-485a-8a4c-f829401a2bee'::uuid, 25, 'Dinesh Kumar', '+918668012225', 'waiting', NOW() - INTERVAL '10 minutes', NULL);