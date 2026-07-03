import { Lock } from "lucide-react";
import { adminSignIn } from "@/app/admin/actions";
import { PageShell, inputClass } from "@/components/ui";

export default async function AdminLoginPage({ searchParams }: { searchParams?: Promise<{ message?: string }> }) {
  const params = await searchParams;

  return (
    <PageShell className="max-w-md">
      <section className="rounded-[2rem] border border-white bg-white/78 p-6 shadow-soft sm:p-8">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-blush-100 text-blush-600">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-2xl font-bold">案例管理登录</h1>
        <p className="mt-3 text-sm leading-6 text-ink/58">这是临时轻后台。请输入服务端环境变量里的管理员密码。</p>
        <form action={adminSignIn} className="mt-6 space-y-4">
          <input className={inputClass} name="password" type="password" required placeholder="ADMIN_PASSWORD" />
          {params?.message ? <p className="text-sm text-blush-600">{params.message}</p> : null}
          <button className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft" type="submit">
            进入后台
          </button>
        </form>
      </section>
    </PageShell>
  );
}
