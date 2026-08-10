import { createClient } from "@supabase/supabase-js";

// MyCar Pro personal Supabase project — pinned so build-time env injection
// can never mix a URL from one project with a key from another
// (that mismatch is what produces "Invalid API key" at sign-in).
const SUPABASE_URL = "https://naxtqmuctbqaffojjduj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5heHRxbXVjdGJxYWZmb2pqZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NzQ5MjUsImV4cCI6MjEwMTI1MDkyNX0.vD8lj7sjjF-jtyHrJ--C0N3rV0nSFXtyX7vEUNkONCY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});
