import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey && supabaseAnonKey !== "your_sb_publishable_key_here"
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
