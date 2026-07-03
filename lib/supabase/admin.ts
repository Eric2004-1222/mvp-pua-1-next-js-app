import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

export function createAdminClient() {
  const config = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!config.isConfigured || !serviceRoleKey) {
    return null;
  }

  return createSupabaseClient(config.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const adminSetupMessage =
  "后台需要配置 SUPABASE_SERVICE_ROLE_KEY 和 ADMIN_PASSWORD。service role key 只能放在服务端环境变量里，不能加 NEXT_PUBLIC_ 前缀。";
