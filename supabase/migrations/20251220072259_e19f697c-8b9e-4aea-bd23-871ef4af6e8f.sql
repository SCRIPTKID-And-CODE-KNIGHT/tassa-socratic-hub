INSERT INTO public.user_roles (user_id, role)
VALUES ('7d7d2bfa-ba9d-4f3e-af33-ebab40455144', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;