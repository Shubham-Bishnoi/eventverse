CREATE TABLE public.wedding_demo_plans (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 access_hash text NOT NULL,
 audience text NOT NULL DEFAULT 'couple',
 venue text NOT NULL DEFAULT 'Udaipur',
 vibe text NOT NULL DEFAULT 'Dreamy',
 ritual text NOT NULL DEFAULT 'Mehndi',
 outfit_saved boolean NOT NULL DEFAULT false,
 tasks jsonb NOT NULL DEFAULT '[]'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.wedding_demo_plans TO service_role;
ALTER TABLE public.wedding_demo_plans ENABLE ROW LEVEL SECURITY;