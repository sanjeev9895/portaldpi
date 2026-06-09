/**
 * Supabase-backed API shim.
 *
 * The app's pages were written against an axios client that talked to a FastAPI
 * backend (api.get/post/put/delete returning an axios-style { data } response).
 * That backend has been removed — this module keeps the exact same interface but
 * fulfils every call directly against Supabase, so no page code had to change.
 *
 * Contract preserved from the old backend:
 *   - GET /attendance returns { data: { data: rows } }  (double-wrapped)
 *   - all other list GETs return { data: rows }          (bare array)
 *   - array/object fields are stored as JSON strings in TEXT columns
 *   - auth endpoints map to Postgres RPC functions (see supabase_setup.sql)
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

type ApiResponse<T = any> = { data: T };

// Surface a clear, actionable error when env vars are missing instead of a
// cryptic network failure against the placeholder client.
function ensureConfigured(): void {
  if (!isSupabaseConfigured) {
    throw apiError(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
        '(locally in frontend/.env; on Vercel in Project Settings -> Environment Variables), then rebuild/redeploy.',
      503
    );
  }
}

// REST-ish resource -> Supabase table name.
const TABLE_MAP: Record<string, string> = {
  employees: 'employees',
  attendance: 'attendance',
  'core-engagements': 'core_engagements',
  'core-team-formation': 'core_team_formations',
  'school-community': 'school_communities',
  'whatsapp-engagements': 'whatsapp_engagements',
  'daily-work-reports': 'daily_work_reports',
};

// GET responses that the old backend wrapped as { data: rows }.
const WRAPPED_LIST = new Set(['attendance']);

function parsePath(path: string): { resource: string; id?: string } {
  const clean = path.split('?')[0].replace(/^\/+/, '').replace(/\/+$/, '');
  const [resource, id] = clean.split('/');
  return { resource, id };
}

// Build an axios-like error so existing `err.response.data.detail/message` reads work.
function apiError(detail: string, statusCode = 400): Error {
  const err = new Error(detail) as Error & { response?: unknown };
  err.response = { status: statusCode, data: { detail, message: detail } };
  return err;
}

// Mirrors the old backend's serialize_db_payload: arrays/objects -> JSON strings
// so they fit the TEXT columns. Plain strings/numbers pass through untouched.
function serialize(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {};
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    out[key] =
      value !== null && typeof value === 'object' ? JSON.stringify(value) : value;
  }
  return out;
}

function makeToken(user: { email?: string }): string {
  // Opaque token kept only so the UI has something in localStorage.
  // Data access is governed by Supabase Row Level Security, not this token.
  try {
    return btoa(`${user?.email || 'user'}:${Date.now()}`);
  } catch {
    return `${user?.email || 'user'}:${Date.now()}`;
  }
}

// ---------------------------------------------------------------------------
// Auth (maps to SECURITY DEFINER Postgres functions)
// ---------------------------------------------------------------------------
async function authPost(action: string, payload: any): Promise<ApiResponse> {
  ensureConfigured();
  if (action === 'login') {
    const { data, error } = await supabase.rpc('login_user', {
      p_email: (payload?.email || '').trim().toLowerCase(),
      p_password: payload?.password || '',
    });
    if (error) throw apiError(error.message, 500);
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) throw apiError('Invalid email or password', 401);
    return { data: { access_token: makeToken(row), token_type: 'bearer', user: row } };
  }

  if (action === 'register') {
    const { data, error } = await supabase.rpc('register_user', {
      p_name: payload?.name,
      p_phone: payload?.phone,
      p_email: (payload?.email || '').trim().toLowerCase(),
      p_password: payload?.password,
      p_role: payload?.role || 'employee',
    });
    if (error) {
      const msg = /registered|duplicate|unique/i.test(error.message)
        ? 'Email is already registered'
        : error.message;
      throw apiError(msg, 400);
    }
    const row = Array.isArray(data) ? data[0] : data;
    return { data: { access_token: makeToken(row), token_type: 'bearer', user: row } };
  }

  if (action === 'reset-password') {
    const { error } = await supabase.rpc('reset_user_password', {
      p_email: (payload?.email || '').trim().toLowerCase(),
      p_new_password: payload?.new_password,
    });
    if (error) throw apiError(error.message, 404);
    return { data: { message: 'Password updated successfully' } };
  }

  throw apiError(`Unknown auth action: ${action}`, 404);
}

// ---------------------------------------------------------------------------
// REST verbs
// ---------------------------------------------------------------------------
async function get(path: string): Promise<ApiResponse> {
  ensureConfigured();
  const { resource, id } = parsePath(path);
  const table = TABLE_MAP[resource];
  if (!table) throw apiError(`Unknown resource: ${resource}`, 404);

  if (id) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw apiError(error.message, 404);
    return { data };
  }

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('id', { ascending: true });
  if (error) throw apiError(error.message, 500);

  const rows = data || [];
  return WRAPPED_LIST.has(resource) ? { data: { data: rows } } : { data: rows };
}

async function post(path: string, payload?: any): Promise<ApiResponse> {
  const { resource, id } = parsePath(path);

  if (resource === 'auth') return authPost(id || '', payload);

  // Legacy admin endpoint — reseeding is managed in Supabase, so this is a no-op
  // that reports success to keep the existing UI happy.
  if (resource === 'db') {
    return { data: { status: 'success', message: 'Database is managed in Supabase.' } };
  }

  ensureConfigured();
  const table = TABLE_MAP[resource];
  if (!table) throw apiError(`Unknown resource: ${resource}`, 404);

  const { data, error } = await supabase
    .from(table)
    .insert(serialize(payload))
    .select()
    .single();
  if (error) throw apiError(error.message, 400);
  return { data };
}

async function put(path: string, payload?: any): Promise<ApiResponse> {
  ensureConfigured();
  const { resource, id } = parsePath(path);
  const table = TABLE_MAP[resource];
  if (!table) throw apiError(`Unknown resource: ${resource}`, 404);
  if (!id) throw apiError('Missing id for update', 400);

  const { data, error } = await supabase
    .from(table)
    .update(serialize(payload))
    .eq('id', id)
    .select()
    .single();
  if (error) throw apiError(error.message, 400);
  return { data };
}

async function del(path: string): Promise<ApiResponse> {
  ensureConfigured();
  const { resource, id } = parsePath(path);
  const table = TABLE_MAP[resource];
  if (!table) throw apiError(`Unknown resource: ${resource}`, 404);
  if (!id) throw apiError('Missing id for delete', 400);

  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw apiError(error.message, 400);
  return { data: { message: 'deleted' } };
}

const api = {
  get,
  post,
  put,
  delete: del,
};

export default api;
