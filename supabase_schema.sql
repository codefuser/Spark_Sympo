-- Grant Table Permissions to Anon & Public API
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Drop Existing Policies if they exist
DROP POLICY IF EXISTS "Public Insert Registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public Select Registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public Insert Participants" ON public.participants;
DROP POLICY IF EXISTS "Public Select Participants" ON public.participants;
DROP POLICY IF EXISTS "Public Insert Events" ON public.events;
DROP POLICY IF EXISTS "Public Select Events" ON public.events;

-- Create Policies for Public Insert & Select
CREATE POLICY "Public Insert Registrations" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Registrations" ON public.registrations FOR SELECT USING (true);
CREATE POLICY "Public Insert Participants" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Participants" ON public.participants FOR SELECT USING (true);
CREATE POLICY "Public Insert Events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Events" ON public.events FOR SELECT USING (true);
