import { createClient } from '@supabase/supabase-js';

// Supabase project credentials. These are safe to expose in the frontend —
// the anon key is designed to be public and access is governed by Row Level
// Security policies in the database. Set these in a .env file locally and in
// the Vercel project settings for production.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surface a clear message during development if env vars are missing.
  console.error(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Create frontend/.env from .env.example and set them.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
