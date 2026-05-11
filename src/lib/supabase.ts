import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using local data.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export const isConfigured = () => !!(supabaseUrl && supabaseAnonKey);

// Función para verificar si Supabase está funcionando correctamente
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!isConfigured()) return false;
  try {
    const { error } = await supabase.from('grados').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};