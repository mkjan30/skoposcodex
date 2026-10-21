-- Supabase grants EXECUTE on public-schema functions to anon/authenticated directly,
-- so 0001's `revoke ... from public` left hit_rate_limit() callable with the anon key.
-- Only the service role (server actions) should be able to call it.

revoke execute on function hit_rate_limit(text, int, int) from anon, authenticated;
grant execute on function hit_rate_limit(text, int, int) to service_role;
