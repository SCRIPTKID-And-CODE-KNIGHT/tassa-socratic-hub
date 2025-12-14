-- Create store_purchases table to track orders
CREATE TABLE public.store_purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id uuid REFERENCES public.store_materials(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  phone_number text NOT NULL,
  email text,
  amount numeric NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_purchases ENABLE ROW LEVEL SECURITY;

-- Anyone can insert purchases
CREATE POLICY "Anyone can submit purchases"
ON public.store_purchases
FOR INSERT
WITH CHECK (true);

-- Admins can view all purchases
CREATE POLICY "Admins can view all purchases"
ON public.store_purchases
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update purchases
CREATE POLICY "Admins can update purchases"
ON public.store_purchases
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_store_purchases_updated_at
BEFORE UPDATE ON public.store_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();