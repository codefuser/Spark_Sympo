-- ====================================================================
-- SPARKTRON 2K26 - Email Messaging & Notification System Schema for Supabase
-- Run this script in the Supabase SQL Editor to enable tables & policies
-- ====================================================================

-- 1. Create Email Messages History Table
CREATE TABLE IF NOT EXISTS public.email_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message_content TEXT NOT NULL,
    template_name TEXT NOT NULL DEFAULT 'CUSTOM',
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Sending, Sent, Delivered, Failed
    provider_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- Index for fast queries on recipient email, registration_id, and created_at
CREATE INDEX IF NOT EXISTS idx_email_messages_recipient_email ON public.email_messages(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_messages_registration_id ON public.email_messages(registration_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_status ON public.email_messages(status);
CREATE INDEX IF NOT EXISTS idx_email_messages_created_at ON public.email_messages(created_at DESC);

-- 2. Create Email & Venue Settings Table
CREATE TABLE IF NOT EXISTS public.email_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    sender_name TEXT NOT NULL DEFAULT 'SPARKTRON 2K26',
    sender_email TEXT NOT NULL DEFAULT 'onboarding@resend.dev',
    reply_to_email TEXT NOT NULL DEFAULT 'sparktron2k26@gmail.com',
    venue_name TEXT NOT NULL DEFAULT 'Thamirabharani Engineering College',
    venue_address TEXT NOT NULL DEFAULT 'ECE Block Auditorium & Labs, College Campus, Tirunelveli',
    map_link TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Thamirabharani+Engineering+College',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    quiz_link TEXT NOT NULL DEFAULT 'https://sparktron-quiz.vercel.app',
    ppt_upload_link TEXT NOT NULL DEFAULT 'https://forms.gle/sparktron2k26ppt',
    project_link TEXT NOT NULL DEFAULT 'https://forms.gle/sparktron2k26project',
    custom_event_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed default settings row if not present
INSERT INTO public.email_settings (
    id,
    sender_name,
    sender_email,
    reply_to_email,
    venue_name,
    venue_address,
    map_link,
    quiz_link,
    ppt_upload_link,
    project_link,
    custom_event_links
) VALUES (
    'default_settings',
    'SPARKTRON 2K26',
    'onboarding@resend.dev',
    'sparktron2k26@gmail.com',
    'Thamirabharani Engineering College',
    'ECE Block Auditorium & Labs, College Campus, Tirunelveli',
    'https://maps.google.com/?q=Thamirabharani+Engineering+College',
    'https://sparktron-quiz.vercel.app',
    'https://forms.gle/sparktron2k26ppt',
    'https://forms.gle/sparktron2k26project',
    '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 3. Grant Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.email_messages TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.email_settings TO anon, authenticated, service_role;

-- 4. Set RLS Policies
ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow All Email Messages Access" ON public.email_messages;
CREATE POLICY "Allow All Email Messages Access" ON public.email_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Email Settings Access" ON public.email_settings;
CREATE POLICY "Allow All Email Settings Access" ON public.email_settings FOR ALL USING (true) WITH CHECK (true);
