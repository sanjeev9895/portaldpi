import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create and export the Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Maps a local API endpoint URL path to the corresponding Supabase table name.
 */
const mapUrlToTable = (url: string): string => {
  // Strip query parameters and split path segments
  const cleanPath = url.split('?')[0];
  const segments = cleanPath.split('/').filter(Boolean);
  const resource = segments[0] || '';

  switch (resource) {
    case 'school-community':
      return 'school_communities';
    case 'core-team-formation':
      return 'core_team_formations';
    case 'core-engagements':
      return 'core_engagements';
    case 'whatsapp-engagements':
      return 'whatsapp_engagements';
    case 'employees':
      return 'employees';
    case 'attendance':
      return 'attendance';
    default:
      return resource;
  }
};

/**
 * Extracts the record ID from the URL path if present.
 * Example: "/employees/12" -> 12
 */
const extractIdFromUrl = (url: string): number | string | null => {
  const cleanPath = url.split('?')[0];
  const segments = cleanPath.split('/').filter(Boolean);
  const idStr = segments[1];
  
  if (!idStr) return null;
  const num = Number(idStr);
  return isNaN(num) ? idStr : num;
};

/**
 * Custom Axios-compatible wrapper around the Supabase Client.
 * Automatically handles HTTP GET, POST, PUT, and DELETE operations.
 */
const api = {
  get: async (url: string) => {
    const table = mapUrlToTable(url);
    const id = extractIdFromUrl(url);
    
    let query = supabase.from(table).select('*');
    if (id !== null) {
      query = query.eq('id', id);
    }
    
    // Sort all records by id ascending for visual ordering consistency
    if (id === null) {
      query = query.order('id', { ascending: true });
    }
    
    const { data, error } = await query;
    if (error) {
      console.error(`Supabase GET error on table "${table}":`, error);
      throw error;
    }
    
    // Format the response to be compatible with axios response structure
    if (id !== null) {
      // Return single record in Axios data format
      return { data: data && data.length > 0 ? data[0] : null };
    }
    
    // Custom wrapper for local API compatibility on GET /attendance
    if (table === 'attendance') {
      return { data: { data } };
    }
    
    return { data };
  },
  
  post: async (url: string, body?: any) => {
    const table = mapUrlToTable(url);
    
    // If body contains an 'id', we let Supabase generate it (identity autoincrement)
    const payload = { ...body };
    if (payload.id) {
      delete payload.id;
    }
    
    const { data, error } = await supabase
      .from(table)
      .insert([payload])
      .select();
      
    if (error) {
      console.error(`Supabase POST error on table "${table}":`, error);
      throw error;
    }
    
    return { data: data && data.length > 0 ? data[0] : null };
  },
  
  put: async (url: string, body?: any) => {
    const table = mapUrlToTable(url);
    const id = extractIdFromUrl(url);
    
    if (id === null) {
      throw new Error(`Cannot perform PUT update without a record ID in URL "${url}"`);
    }
    
    const payload = { ...body };
    // ID should not be updated in the payload
    if (payload.id) {
      delete payload.id;
    }
    
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error(`Supabase PUT error on table "${table}" at ID ${id}:`, error);
      throw error;
    }
    
    return { data: data && data.length > 0 ? data[0] : null };
  },
  
  delete: async (url: string) => {
    const table = mapUrlToTable(url);
    const id = extractIdFromUrl(url);
    
    if (id === null) {
      throw new Error(`Cannot perform DELETE operation without a record ID in URL "${url}"`);
    }
    
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Supabase DELETE error on table "${table}" at ID ${id}:`, error);
      throw error;
    }
    
    return { data };
  }
};

export default api;