import { createClient } from '@supabase/supabase-js';

// Set these in your .env (Vite requires the VITE_ prefix to expose them
// to the browser). Use the project's anon/public key here — never the
// service role key — Row-Level Security (Phase 2) is what keeps this safe
// for public, unauthenticated visitors.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
