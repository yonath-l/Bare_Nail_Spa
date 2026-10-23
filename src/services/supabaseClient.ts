/**
 * Supabase Client & Environment Abstraction
 *
 * Rule 3 (Environment Variables):
 * - VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are prefixed with VITE_ and are exposed to the browser bundle by design.
 * - Sensitive service role keys must NEVER be prefixed with VITE_ or used in client-side code.
 */

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return {
    supabaseUrl: url,
    supabaseAnonKey: key,
    isConfigured: Boolean(url && key && !url.includes('placeholder')),
  };
};

/**
 * Lightweight REST-based Supabase Query Helper
 * Allows production connectivity without requiring a heavy @supabase/supabase-js bundle.
 */
export class SupabaseAdapter {
  private static config = getSupabaseConfig();

  static async fetchFromTable<T>(tableName: string, queryParams: string = ''): Promise<T[] | null> {
    if (!this.config.isConfigured) return null;

    try {
      const response = await fetch(`${this.config.supabaseUrl}/rest/v1/${tableName}?${queryParams}`, {
        headers: {
          apikey: this.config.supabaseAnonKey,
          Authorization: `Bearer ${this.config.supabaseAnonKey}`,
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  static async insertIntoTable<T>(tableName: string, data: Partial<T>): Promise<T | null> {
    if (!this.config.isConfigured) return null;

    try {
      const response = await fetch(`${this.config.supabaseUrl}/rest/v1/${tableName}`, {
        method: 'POST',
        headers: {
          apikey: this.config.supabaseAnonKey,
          Authorization: `Bearer ${this.config.supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) return null;
      const result = await response.json();
      return Array.isArray(result) ? result[0] : result;
    } catch {
      return null;
    }
  }
}
