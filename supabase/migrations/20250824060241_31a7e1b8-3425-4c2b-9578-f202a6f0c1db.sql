-- Create payment status table
CREATE TABLE public.payment_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  series_number INTEGER NOT NULL CHECK (series_number BETWEEN 1 AND 4),
  amount DECIMAL(10,2),
  payment_date DATE,
  payment_method TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'partial', 'overdue')),
  receipt_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(school_id, series_number)
);

-- Create store materials table
CREATE TABLE public.store_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  material_type TEXT NOT NULL CHECK (material_type IN ('book', 'lesson_notes', 'scheme_of_work', 'lesson_plans', 'log_books')),
  file_url TEXT,
  price DECIMAL(10,2),
  subject TEXT,
  grade_level TEXT,
  published_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  created_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create results table
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  school_id UUID REFERENCES public.schools(id),
  region TEXT NOT NULL,
  district TEXT NOT NULL,
  series_number INTEGER NOT NULL,
  subject TEXT NOT NULL,
  marks INTEGER NOT NULL,
  grade TEXT NOT NULL,
  position INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create top students table  
CREATE TABLE public.top_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  school_name TEXT NOT NULL,
  region TEXT NOT NULL,
  district TEXT NOT NULL,
  series_number INTEGER NOT NULL,
  subject TEXT NOT NULL,
  marks INTEGER NOT NULL,
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 10),
  published_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create best schools table
CREATE TABLE public.best_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL,
  region TEXT NOT NULL,
  district TEXT NOT NULL,
  series_number INTEGER NOT NULL,
  average_marks DECIMAL(5,2) NOT NULL,
  position INTEGER NOT NULL,
  total_students INTEGER,
  published_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create participation confirmations table
CREATE TABLE public.participation_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  series_number INTEGER NOT NULL,
  confirmed_by TEXT NOT NULL,
  confirmed_date DATE DEFAULT CURRENT_DATE,
  number_of_students INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(school_id, series_number)
);

-- Enable RLS on all tables
ALTER TABLE public.payment_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.best_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participation_confirmations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payment_status
CREATE POLICY "Anyone can view payment status" ON public.payment_status
FOR SELECT USING (true);

CREATE POLICY "Admins can manage payment status" ON public.payment_status
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for store_materials
CREATE POLICY "Anyone can view published materials" ON public.store_materials
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all materials" ON public.store_materials
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for contact_messages
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all messages" ON public.contact_messages
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update message status" ON public.contact_messages
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for announcements
CREATE POLICY "Anyone can view published announcements" ON public.announcements
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage announcements" ON public.announcements
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for results
CREATE POLICY "Anyone can view results" ON public.results
FOR SELECT USING (true);

CREATE POLICY "Admins can manage results" ON public.results
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for top_students
CREATE POLICY "Anyone can view published top students" ON public.top_students
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage top students" ON public.top_students
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for best_schools
CREATE POLICY "Anyone can view published best schools" ON public.best_schools
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage best schools" ON public.best_schools
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for participation_confirmations
CREATE POLICY "Anyone can view confirmations" ON public.participation_confirmations
FOR SELECT USING (true);

CREATE POLICY "Anyone can confirm participation" ON public.participation_confirmations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage confirmations" ON public.participation_confirmations
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_payment_status_updated_at
  BEFORE UPDATE ON public.payment_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_materials_updated_at
  BEFORE UPDATE ON public.store_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_results_updated_at
  BEFORE UPDATE ON public.results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_top_students_updated_at
  BEFORE UPDATE ON public.top_students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_best_schools_updated_at
  BEFORE UPDATE ON public.best_schools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_participation_confirmations_updated_at
  BEFORE UPDATE ON public.participation_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();