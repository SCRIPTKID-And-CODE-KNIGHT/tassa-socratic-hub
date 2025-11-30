-- Create table for school results links management
CREATE TABLE IF NOT EXISTS public.school_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  series_number INTEGER NOT NULL,
  general_results_url TEXT,
  top_ten_students_url TEXT,
  top_ten_schools_url TEXT,
  individual_results_url TEXT,
  published_by UUID,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(school_id, series_number)
);

-- Enable RLS
ALTER TABLE public.school_results ENABLE ROW LEVEL SECURITY;

-- Admins can manage school results
CREATE POLICY "Admins can manage school results"
ON public.school_results
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view published school results
CREATE POLICY "Anyone can view published school results"
ON public.school_results
FOR SELECT
TO authenticated, anon
USING (is_published = true);

-- Create updated_at trigger
CREATE TRIGGER update_school_results_updated_at
BEFORE UPDATE ON public.school_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for general results (not school-specific)
CREATE TABLE IF NOT EXISTS public.general_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_number INTEGER NOT NULL UNIQUE,
  general_results_url TEXT,
  top_ten_students_url TEXT,
  top_ten_schools_url TEXT,
  published_by UUID,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.general_results ENABLE ROW LEVEL SECURITY;

-- Admins can manage general results
CREATE POLICY "Admins can manage general results"
ON public.general_results
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view published general results
CREATE POLICY "Anyone can view published general results"
ON public.general_results
FOR SELECT
TO authenticated, anon
USING (is_published = true);

-- Create updated_at trigger
CREATE TRIGGER update_general_results_updated_at
BEFORE UPDATE ON public.general_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();