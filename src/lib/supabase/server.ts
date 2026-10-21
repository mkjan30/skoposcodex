import "server-only";

import { createClient } from "@supabase/supabase-js";

/** Service-role client for server actions. Bypasses RLS — only call after validating input. */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured (see .env.example).");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
