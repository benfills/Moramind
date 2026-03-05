const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('EXPO_PUBLIC_SUPABASE_URL is not set');
if (!supabaseAnonKey) throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY is not set');

export const Config = {
  supabaseUrl,
  supabaseAnonKey,
  apiEnv: process.env.EXPO_PUBLIC_API_ENV ?? 'development',
} as const;
