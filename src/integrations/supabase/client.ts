import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://naxtqmuctbqaffojjduj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5heHRxbXVjdGJxYWZmb2pqZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NzQ5MjUsImV4cCI6MjEwMTI1MDkyNX0.vD8lj7sjjF-jtyHrJ--C0N3rV0nSFXtyX7vEUNkONCY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});
