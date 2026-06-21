
-- Committees (future-ready: Academic Secretariat, Executive, Media, etc.)
CREATE TABLE public.committees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.committees TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.committees TO authenticated;
GRANT ALL ON public.committees TO service_role;

ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active committees"
  ON public.committees FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage committees"
  ON public.committees FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_committees_updated
  BEFORE UPDATE ON public.committees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Committee members
CREATE TABLE public.committee_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id uuid NOT NULL REFERENCES public.committees(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  position text NOT NULL DEFAULT 'Member', -- 'Chairperson' | 'Member' | future roles
  is_chairperson boolean NOT NULL DEFAULT false,
  school text,
  region text,
  biography text,
  profile_image_url text,
  email text,
  phone text,
  profile_link text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_committee_members_committee ON public.committee_members(committee_id, display_order);

GRANT SELECT ON public.committee_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.committee_members TO authenticated;
GRANT ALL ON public.committee_members TO service_role;

ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active members"
  ON public.committee_members FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage committee members"
  ON public.committee_members FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_committee_members_updated
  BEFORE UPDATE ON public.committee_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for committee-images bucket (bucket itself created via storage tool)
CREATE POLICY "Public read committee images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'committee-images');

CREATE POLICY "Admins upload committee images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'committee-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update committee images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'committee-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete committee images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'committee-images' AND public.has_role(auth.uid(), 'admin'));

-- Seed Academic Secretariat
INSERT INTO public.committees (slug, name, description, display_order)
VALUES ('academic-secretariat', 'Academic Secretariat & Evaluation Committee',
        'The body responsible for academic evaluation, examination integrity, and curriculum oversight across TASSA.', 1);

WITH c AS (SELECT id FROM public.committees WHERE slug = 'academic-secretariat')
INSERT INTO public.committee_members (committee_id, full_name, position, is_chairperson, school, region, display_order)
VALUES
  ((SELECT id FROM c), 'Ally Twaha Mulokozi', 'Chairperson', true, 'Kaizerege & Kemibos High School', 'Kagera', 0),
  ((SELECT id FROM c), 'Joseph Lubasha Mayinga', 'Member', false, 'Ziba S.S', 'Tabora', 1),
  ((SELECT id FROM c), 'Ansorn Wilbard Mbelwa', 'Member', false, 'Nyabuzizi S.S', 'Kagera', 2),
  ((SELECT id FROM c), 'Mademla Emmanuel', 'Member', false, 'Shinyanga S.S', 'Shinyanga', 3),
  ((SELECT id FROM c), 'Omary Jalali Mombo', 'Member', false, 'Arusha Science S.S', 'Arusha', 4),
  ((SELECT id FROM c), 'Kastory Epimack Maligete', 'Member', false, 'Lucas Malia S.S', 'Kigoma', 5),
  ((SELECT id FROM c), 'Nestory Ernest', 'Member', false, 'Kagango S.S', 'Kagera', 6),
  ((SELECT id FROM c), 'Bashiru Said', 'Member', false, 'Laureate School of Zanzibar', 'Zanzibar', 7),
  ((SELECT id FROM c), 'Luca Sulle', 'Member', false, 'Mulbadaw S.S', 'Manyara', 8),
  ((SELECT id FROM c), 'Amosi Nshanshi Singili', 'Member', false, 'Beroya S.S', 'Ruvuma', 9),
  ((SELECT id FROM c), 'Melizabeth Justine Mlazi', 'Member', false, 'Kifungilo Girls S.S', 'Tanga', 10),
  ((SELECT id FROM c), 'Gordwin Mombeki', 'Member', false, 'Janeth Magufuli Girls S.S', 'Geita', 11);
