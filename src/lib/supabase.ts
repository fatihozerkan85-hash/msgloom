import { createClient } from "@supabase/supabase-js";

export const storageBucket =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "patterns";

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

export const isSupabaseConfigured =
  supabaseConfig.url.length > 0 && supabaseConfig.anonKey.length > 0;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;
