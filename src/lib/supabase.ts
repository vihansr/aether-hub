import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://kvtjiruauqamjlkzvdmc.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dGppcnVhdXFhbWpsa3p2ZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTczNzcsImV4cCI6MjA5NjA3MzM3N30.GsdCN-Gz1S1DdoPLnKHJiZiV-L17GplJ9MBMzZYmotU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Test connecting to the Supabase database.
 */
export async function testDatabaseConnection() {
  try {
    // Perform a lightweight check on the database connection
    const { data, error } = await supabase.from('todos').select('id').limit(1);

    if (error && error.code !== '42P01') { // 42P01 is undefined table, which still confirms DB connection works
      return {
        success: false,
        message: `Database connection returned an error: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Successfully connected to the Supabase PostgreSQL database!',
      data
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect: ${err.message || err}`,
      error: err
    };
  }
}
