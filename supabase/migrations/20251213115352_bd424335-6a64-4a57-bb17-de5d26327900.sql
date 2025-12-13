INSERT INTO public.user_roles (user_id, role)
VALUES ('fa21b5a6-2e4e-47e8-8c0b-3f8264b9ac94', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;