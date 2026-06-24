import { createClient } from "@supabase/supabase-js";

// Admin client — uses the SECRET (service_role) key. SERVER ONLY.
// Never import this into a Client Component; it bypasses row-level security.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
