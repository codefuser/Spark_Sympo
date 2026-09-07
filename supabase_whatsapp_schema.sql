-- ====================================================================
-- SPARKTRON 2K26 - WhatsApp Messaging System Schema for Supabase
-- Run this script in the Supabase SQL Editor to enable tables & policies
-- ====================================================================

-- 1. Create WhatsApp Messages History Table
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'CUSTOM',
    message_content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Sending, Sent, Delivered, Read, Failed
    provider_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ
);

-- Index for speedy queries on recipient phone, registration_id and created_at
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_recipient_phone ON public.whatsapp_messages(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_registration_id ON public.whatsapp_messages(registration_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status ON public.whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON public.whatsapp_messages(created_at DESC);

-- 2. Create WhatsApp & Event Links Settings Table
CREATE TABLE IF NOT EXISTS public.whatsapp_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    venue_name TEXT NOT NULL DEFAULT 'St. Joseph''s Institute of Technology',
    venue_address TEXT NOT NULL DEFAULT 'ECE Block Auditorium & Labs, College Campus, OMR, Chennai - 600119',
    map_link TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=St.+Joseph%27s+Institute+of+Technology',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    quiz_link TEXT NOT NULL DEFAULT 'https://sparktron-quiz.vercel.app',
    ppt_upload_link TEXT NOT NULL DEFAULT 'https://forms.gle/sparktron2k26ppt',
    project_link TEXT NOT NULL DEFAULT 'https://forms.gle/sparktron2k26project',
    custom_event_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed default settings row if not present
INSERT INTO public.whatsapp_settings (
    id,
    is_enabled,
    venue_name,
    venue_address,
    map_link,
    quiz_link,
    ppt_upload_link,
    project_link,
    custom_event_links
) VALUES (
    'default_settings',
    true,
    'St. Joseph''s Institute of Technology',
    'ECE Block Auditorium & Labs, College Campus, OMR, Chennai - 600119',
    'https://maps.google.com/?q=St.+Joseph%27s+Institute+of+Technology',
    'https://sparktron-quiz.vercel.app',
    'https://forms.gle/sparktron2k26ppt',
    'https://forms.gle/sparktron2k26project',
    '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 3. Grant Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.whatsapp_messages TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.whatsapp_settings TO anon, authenticated, service_role;

-- 4. Set RLS Policies
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow All Whatsapp Messages Access" ON public.whatsapp_messages;
CREATE POLICY "Allow All Whatsapp Messages Access" ON public.whatsapp_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Whatsapp Settings Access" ON public.whatsapp_settings;
CREATE POLICY "Allow All Whatsapp Settings Access" ON public.whatsapp_settings FOR ALL USING (true) WITH CHECK (true);
