export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const isPlaceholderUrl = url.includes("example.supabase.co") || url.includes("your-project.supabase.co");
  const isPlaceholderKey = anonKey === "dummy" || anonKey === "your-anon-key";

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && !isPlaceholderUrl && !isPlaceholderKey),
  };
}

export const supabaseSetupMessage =
  "Supabase 尚未配置真实项目地址和 anon key。请创建 .env.local，填入 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 后重启开发服务器。";

export function getAuthErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (message === "fetch failed" || message.includes("fetch failed")) {
    return "无法连接 Supabase。请检查 .env.local 是否填写了真实 Supabase URL / anon key，并确认本机网络可以访问 Supabase。";
  }

  if (message.toLowerCase().includes("invalid login credentials")) {
    return "邮箱或密码不正确，请检查后重试。";
  }

  if (message.toLowerCase().includes("email not confirmed")) {
    return "邮箱还没有完成验证，请先打开 Supabase 发来的确认邮件。";
  }

  return message || "操作失败，请稍后再试。";
}
