import { Suspense } from "react";
import { Field, PageShell, inputClass } from "@/components/ui";
import { signIn, signUp } from "@/app/actions";
import { getSupabaseConfig, supabaseSetupMessage } from "@/lib/supabase/config";

function LoginForms({ message, isConfigured }: { message?: string; isConfigured: boolean }) {
  const visibleMessage = !isConfigured ? supabaseSetupMessage : message;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
      {visibleMessage ? (
        <div className="rounded-2xl border border-blush-100 bg-blush-50 p-4 text-sm leading-6 text-blush-700 md:col-span-2">
          <p>{visibleMessage}</p>
          {!isConfigured ? (
            <code className="mt-3 block rounded-xl bg-white/75 p-3 text-xs leading-6 text-ink/70">
              NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co{"\n"}
              NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon public key
            </code>
          ) : null}
        </div>
      ) : null}
      <section className="rounded-2xl border border-white bg-white/78 p-6 shadow-soft">
        <h1 className="text-2xl font-bold">登录</h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">回到社区，继续接住彼此的小情绪。</p>
        <form action={signIn} className="mt-6 space-y-4">
          <Field label="邮箱">
            <input className={inputClass} name="email" type="email" required placeholder="you@example.com" />
          </Field>
          <Field label="密码">
            <input className={inputClass} name="password" type="password" required minLength={6} placeholder="至少 6 位" />
          </Field>
          <button className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft" type="submit">
            登录
          </button>
        </form>
      </section>
      <section className="rounded-2xl border border-white bg-white/78 p-6 shadow-soft">
        <h2 className="text-2xl font-bold">注册</h2>
        <p className="mt-2 text-sm leading-6 text-ink/60">创建一个新账号，可以匿名发帖，也可以绑定情侣空间。</p>
        <form action={signUp} className="mt-6 space-y-4">
          <Field label="昵称">
            <input className={inputClass} name="nickname" placeholder="比如：小番茄" />
          </Field>
          <Field label="邮箱">
            <input className={inputClass} name="email" type="email" required placeholder="you@example.com" />
          </Field>
          <Field label="密码">
            <input className={inputClass} name="password" type="password" required minLength={6} placeholder="至少 6 位" />
          </Field>
          <button className="w-full rounded-full bg-blush-500 px-5 py-3 text-sm font-semibold text-white shadow-soft" type="submit">
            注册
          </button>
        </form>
      </section>
    </div>
  );
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams;
  const config = getSupabaseConfig();
  return (
    <PageShell>
      <Suspense>
        <LoginForms message={params.message} isConfigured={config.isConfigured} />
      </Suspense>
    </PageShell>
  );
}
