-- Create exam_settings table for countdown configuration
CREATE TABLE public.exam_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_date timestamp with time zone NOT NULL,
  series_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.exam_settings ENABLE ROW LEVEL SECURITY;

-- Policies for exam_settings
CREATE POLICY "Admins can manage exam settings"
ON public.exam_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active exam settings"
ON public.exam_settings
FOR SELECT
USING (is_active = true);

-- Create almanac_events table for series schedule
CREATE TABLE public.almanac_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  series_number integer NOT NULL,
  event_date date NOT NULL,
  event_name text NOT NULL,
  responsible_person text NOT NULL,
  description text,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.almanac_events ENABLE ROW LEVEL SECURITY;

-- Policies for almanac_events
CREATE POLICY "Admins can manage almanac events"
ON public.almanac_events
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published almanac events"
ON public.almanac_events
FOR SELECT
USING (is_published = true);

-- Insert default exam setting for January 21, 2026
INSERT INTO public.exam_settings (exam_date, series_name, is_active)
VALUES ('2026-01-21T08:00:00+03:00', 'Series 5 Exam 2026', true);

-- Create trigger for updated_at
CREATE TRIGGER update_exam_settings_updated_at
BEFORE UPDATE ON public.exam_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_almanac_events_updated_at
BEFORE UPDATE ON public.almanac_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();