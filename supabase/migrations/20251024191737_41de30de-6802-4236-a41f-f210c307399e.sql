-- Create shops table
CREATE TABLE public.shops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  name_tamil TEXT NOT NULL,
  location TEXT NOT NULL,
  location_tamil TEXT NOT NULL,
  qr_code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tokens table
CREATE TABLE public.tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  token_number INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(shop_id, token_number)
);

-- Create shop_users junction table
CREATE TABLE public.shop_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(shop_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shops
CREATE POLICY "Shop owners can view their shops"
  ON public.shops FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.shop_users
      WHERE shop_users.shop_id = shops.id
      AND shop_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Shop owners can update their shops"
  ON public.shops FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.shop_users
      WHERE shop_users.shop_id = shops.id
      AND shop_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view active shops by QR code"
  ON public.shops FOR SELECT
  USING (is_active = true);

-- RLS Policies for tokens
CREATE POLICY "Shop owners can view their tokens"
  ON public.tokens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = tokens.shop_id
      AND (
        shops.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.shop_users
          WHERE shop_users.shop_id = shops.id
          AND shop_users.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Shop owners can update their tokens"
  ON public.tokens FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = tokens.shop_id
      AND (
        shops.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.shop_users
          WHERE shop_users.shop_id = shops.id
          AND shop_users.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Anyone can insert tokens"
  ON public.tokens FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view tokens"
  ON public.tokens FOR SELECT
  USING (true);

-- RLS Policies for shop_users
CREATE POLICY "Shop owners can view their shop_users"
  ON public.shop_users FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = shop_users.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Create function to get next token number
CREATE OR REPLACE FUNCTION public.get_next_token_number(p_shop_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON public.shops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_tokens_shop_id ON public.tokens(shop_id);
CREATE INDEX idx_tokens_status ON public.tokens(status);
CREATE INDEX idx_tokens_created_at ON public.tokens(created_at);
CREATE INDEX idx_shops_qr_code ON public.shops(qr_code);
CREATE INDEX idx_shop_users_shop_id ON public.shop_users(shop_id);
CREATE INDEX idx_shop_users_user_id ON public.shop_users(user_id);

-- Enable realtime for tokens table
ALTER PUBLICATION supabase_realtime ADD TABLE public.tokens;