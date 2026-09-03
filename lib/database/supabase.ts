import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://ickymxuqprfbekxumpop.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja3lteHVxcHJmYmVreHVtcG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NDM0NTYsImV4cCI6MjEwNDAxOTQ1Nn0.E7_i_XCbNJGNFif-uEQnG8d5voIn2DalZUBlXXV_SMU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
