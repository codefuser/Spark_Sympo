-- ==============================================================================
-- SPARKTRON 2K26 - SHARED BACKEND SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Shared Database for:
-- Website 1: Online Public Registration
-- Website 2: Offline College Volunteer Registration
-- Website 3: Secured Technical Quiz System
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. EVENTS TABLE (Centralized Event Configuration & Member Limits)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('TECHNICAL', 'NON_TECHNICAL', 'WORKSHOP', 'QUIZ')),
  short_desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  rules TEXT,
  eligibility TEXT,
  team_size VARCHAR(50) DEFAULT '1-2 Members',
  min_members INT NOT NULL DEFAULT 1,
  max_members INT NOT NULL DEFAULT 5,
  max_teams INT DEFAULT 100,
  rounds VARCHAR(100),
  date VARCHAR(100),
  time VARCHAR(100),
  venue VARCHAR(200),
  coordinator_name VARCHAR(150),
  coordinator_phone VARCHAR(50),
  status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'UPCOMING')),
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. REGISTRATIONS TABLE (Supports both 'online' and 'offline' registration types)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_code VARCHAR(50) UNIQUE NOT NULL,
  registration_type VARCHAR(20) NOT NULL DEFAULT 'online' CHECK (registration_type IN ('online', 'offline')),
  technical_event_id UUID REFERENCES public.events(id) ON DELETE RESTRICT,
  non_technical_event_id UUID REFERENCES public.events(id) ON DELETE RESTRICT,
  team_name VARCHAR(150),
  status VARCHAR(20) DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'PENDING', 'CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for quick search on registration code & events
CREATE INDEX IF NOT EXISTS idx_registrations_code ON public.registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_registrations_tech_event ON public.registrations(technical_event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_nontech_event ON public.registrations(non_technical_event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_type ON public.registrations(registration_type);

-- ------------------------------------------------------------------------------
-- 3. PARTICIPANTS TABLE (Contains participant details & food preferences)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  college VARCHAR(250) NOT NULL,
  food_preference VARCHAR(20) NOT NULL DEFAULT 'Veg' CHECK (food_preference IN ('Veg', 'Non-Veg')),
  is_team_leader BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for email lookups (used for duplicate prevention & quiz eligibility)
CREATE INDEX IF NOT EXISTS idx_participants_email ON public.participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_reg_id ON public.participants(registration_id);

-- ------------------------------------------------------------------------------
-- 4. QUIZ SETTINGS TABLE (Controls Quiz Start/End Access Window for Website 3)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_title VARCHAR(200) DEFAULT 'SPARKTRON 2K26 Technical Quiz',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  duration_minutes INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. QUIZ QUESTIONS & ATTEMPTS TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'GENERAL',
  points INT DEFAULT 10,
  options JSONB NOT NULL, -- [{ "id": "1", "text": "Option A", "isCorrect": true }]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  participant_email VARCHAR(200) NOT NULL,
  score INT DEFAULT 0,
  total_questions INT DEFAULT 0,
  time_taken_seconds INT DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 1. Public view access for active events & quiz settings
CREATE POLICY "Public Read Events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Public Read Quiz Settings" ON public.quiz_settings
  FOR SELECT USING (true);

-- 2. Public insertion allowed for registrations (Website 1 & Website 2)
CREATE POLICY "Public Insert Registrations" ON public.registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Select Registrations" ON public.registrations
  FOR SELECT USING (true);

CREATE POLICY "Public Insert Participants" ON public.participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Select Participants" ON public.participants
  FOR SELECT USING (true);

-- 3. Quiz Eligibility Verification Function (Server/DB side check for Website 3)
CREATE OR REPLACE FUNCTION public.check_quiz_eligibility(user_email TEXT)
RETURNS TABLE (
  is_registered BOOLEAN,
  has_quiz_event BOOLEAN,
  is_within_time_window BOOLEAN,
  registration_code VARCHAR,
  participant_name VARCHAR
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_reg_code VARCHAR;
  v_part_name VARCHAR;
  v_has_quiz BOOLEAN := FALSE;
  v_time_valid BOOLEAN := FALSE;
  v_quiz_event_id UUID;
BEGIN
  -- Check if user email exists in participants
  SELECT p.full_name, r.registration_code INTO v_part_name, v_reg_code
  FROM public.participants p
  JOIN public.registrations r ON r.id = p.registration_id
  JOIN public.events e ON (e.id = r.technical_event_id OR e.id = r.non_technical_event_id)
  WHERE LOWER(TRIM(p.email)) = LOWER(TRIM(user_email)) AND e.slug = 'technical-quiz'
  LIMIT 1;

  IF v_reg_code IS NOT NULL THEN
    v_has_quiz := TRUE;
  END IF;

  -- Check if current time is within quiz window
  SELECT (NOW() >= start_time AND NOW() <= end_time AND is_active = true) INTO v_time_valid
  FROM public.quiz_settings
  ORDER BY created_at DESC LIMIT 1;

  RETURN QUERY SELECT 
    (v_part_name IS NOT NULL) AS is_registered,
    v_has_quiz AS has_quiz_event,
    COALESCE(v_time_valid, FALSE) AS is_within_time_window,
    v_reg_code AS registration_code,
    v_part_name AS participant_name;
END;
$$;

-- ==============================================================================
-- INITIAL SEED DATA FOR SUPABASE
-- ==============================================================================

-- Seed Technical & Non-Technical Events
INSERT INTO public.events (slug, title, category, short_desc, full_desc, rules, eligibility, team_size, min_members, max_members, max_teams, rounds, date, time, venue, coordinator_name, coordinator_phone, status)
VALUES
  (
    'paper-presentation',
    'Paper Presentation',
    'TECHNICAL',
    'National Level Technical Paper & Innovation Presentation Symposium.',
    'Showcase original research, project ideas, and technical write-ups in VLSI Design, 5G Communications, Embedded AI, Signal Processing, and IoT Sensors.',
    '1. Abstract submission required prior to event day. 2. Team size max 3 members. 3. Presentation time: 8 mins talk + 2 mins Q&A.',
    'Engineering undergraduates & diploma students',
    '1-3 Members',
    1,
    3,
    50,
    '1 Round (Presentation + Q&A)',
    'September 16, 2026',
    '10:00 AM - 01:00 PM',
    'ECE Seminar Hall, Ground Floor',
    'Prof. S. Meenakshi',
    '+91 98402 34567',
    'OPEN'
  ),
  (
    'technical-quiz',
    'Technical Quiz',
    'TECHNICAL',
    'Fast-paced live digital quiz testing core electronics, computing, and tech trivia.',
    'Compete against top minds in real-time online quiz rounds. Tests knowledge in analog electronics, digital circuits, microcontrollers, AI, and computer systems.',
    '1. Max 2 members per team. 2. Timed online portal access. 3. Strictly single attempt during official quiz window.',
    'Open to all registered engineering students',
    '1-2 Members',
    1,
    2,
    100,
    'Prelims + Live Final Round',
    'September 16, 2026',
    '10:00 AM - 10:30 AM',
    'Digital Quiz Portal / Computer Center',
    'Dr. K. Ramprasath',
    '+91 98401 23456',
    'OPEN'
  ),
  (
    'circuit-debugging',
    'Circuit Debugging',
    'TECHNICAL',
    'Ultimate schematic debugging, breadboard synthesis, and hardware troubleshooting.',
    'Debug complex electronic circuits containing hidden glitches, faulty components, and logic mismatches. Reconstruct operational states on breadboards and simulate output signals.',
    '1. Max 2 members per team. 2. Standard components provided by ECE lab. 3. Round 1: Debugging quiz; Round 2: Breadboard synthesis.',
    'UG/PG Engineering Students (ECE, EEE, EIE, CSE, IT)',
    '1-2 Members',
    1,
    2,
    60,
    '2 Rounds',
    'September 16, 2026',
    '11:30 AM - 01:30 PM',
    'VLSI & Embedded Systems Lab, 2nd Floor',
    'Dr. R. Vigneshwaren',
    '+91 98403 45678',
    'OPEN'
  ),
  (
    'rythemania',
    'Rythemania',
    'NON_TECHNICAL',
    'Energetic non-technical group music, dance, & performance battle.',
    'Unleash stage energy and show-stopping performances! Rythemania brings together creative choreography, rhythm synchronization, and musical fusion.',
    '1. Team size: 1-5 members. 2. Time limit: 5 minutes per team. 3. Submit audio tracks 30 mins prior to event start.',
    'Open to all symposium participants',
    '1-5 Members',
    1,
    5,
    40,
    'Stage Performance',
    'September 16, 2026',
    '02:00 PM - 04:30 PM',
    'Main Campus Open Air Theater',
    'Mr. B. Gautham',
    '+91 98406 78901',
    'OPEN'
  ),
  (
    'e-sports',
    'E-Sports',
    'NON_TECHNICAL',
    'High-octane mobile & multiplayer LAN gaming battleground tournament.',
    'Test tactical gaming instincts in custom room tournament duels. Features strategic battle royale and fast tactical FPS multiplayer matches.',
    '1. Max 4 members per squad. 2. Players must use their own mobile devices. 3. Tournament brackets strictly enforced.',
    'Open to all symposium participants',
    '1-4 Members',
    1,
    4,
    60,
    'Knockout Brackets + Grand Finals',
    'September 16, 2026',
    '01:30 PM - 04:00 PM',
    'Seminar Hall Arena & Media Hub',
    'Er. A. Dinesh Kumar',
    '+91 98404 56789',
    'OPEN'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  min_members = EXCLUDED.min_members,
  max_members = EXCLUDED.max_members;

-- Seed Default Quiz Window Settings (Active for Quiz Website 3)
INSERT INTO public.quiz_settings (quiz_title, start_time, end_time, is_active, duration_minutes)
VALUES (
  'SPARKTRON 2K26 Technical Quiz',
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '24 hours',
  true,
  30
);
