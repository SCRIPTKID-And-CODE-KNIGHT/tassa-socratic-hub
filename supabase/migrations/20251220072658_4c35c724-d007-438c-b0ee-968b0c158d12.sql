-- Create storage bucket for result submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('result-submissions', 'result-submissions', false);

-- Create RLS policies for the bucket
CREATE POLICY "Anyone can upload result submissions"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'result-submissions');

CREATE POLICY "Admins can view all result submissions"
ON storage.objects
FOR SELECT
USING (bucket_id = 'result-submissions' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete result submissions"
ON storage.objects
FOR DELETE
USING (bucket_id = 'result-submissions' AND has_role(auth.uid(), 'admin'));

-- Create table to track submissions
CREATE TABLE public.result_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  teacher_email TEXT,
  teacher_phone TEXT NOT NULL,
  series_number INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.result_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit results
CREATE POLICY "Anyone can submit results"
ON public.result_submissions
FOR INSERT
WITH CHECK (true);

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
ON public.result_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update submissions
CREATE POLICY "Admins can update submissions"
ON public.result_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete submissions
CREATE POLICY "Admins can delete submissions"
ON public.result_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_result_submissions_updated_at
BEFORE UPDATE ON public.result_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();