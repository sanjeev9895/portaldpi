import { createClient } from '@supabase/supabase-js';

// Supabase project credentials. Safe to expose in the frontend — the anon key
// is designed to be public; access is governed by Row Level Security.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// True only when both values are present and not left as placeholders.
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('YOUR-PROJECT-REF') &&
    !supabaseAnonKey.startsWith('your-')
);

if (!isSupabaseConfigured) {
  console.error(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are missing or still placeholders.\n' +
      '- Local dev: fill them in frontend/.env, then restart `npm run dev`.\n' +
      '- Vercel: Project Settings -> Environment Variables, add both, then REDEPLOY (values are baked in at build time).'
  );
}

// IMPORTANT: never throw at import time — a missing config must not
// white-screen the whole app. Fall back to harmless placeholder values;
// actual calls will surface a clear error message instead (see api.ts).
export const supabase = createClient(
  isSupabaseConfigured ? (supabaseUrl as string) : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? (supabaseAnonKey as string) : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export default supabase;
