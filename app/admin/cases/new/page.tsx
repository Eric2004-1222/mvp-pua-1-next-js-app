import Link from "next/link";
import { createCase } from "@/app/admin/actions";
import { AdminNav } from "@/app/admin/admin-nav";
import { CaseForm } from "@/app/admin/case-form";
import { PageShell } from "@/components/ui";
import { requireAdmin } from "@/lib/admin";

export default async function NewCasePage({ searchParams }: { searchParams?: Promise<{ message?: string }> }) {
  await requireAdmin();
  const params = await searchParams;

  return (
    <PageShell className="pb-16">
      <AdminNav />
      <div className="mb-6">
        <Link href="/admin/cases" className="text-sm font-medium text-ink/55 transition hover:text-ink">
          返回案例管理
        </Link>
        <h1 className="mt-3 text-3xl font-bold">新增案例</h1>
        {params?.message ? <p className="mt-3 rounded-2xl bg-blush-50 p-4 text-sm text-blush-700">{params.message}</p> : null}
      </div>
      <section className="rounded-2xl border border-white bg-white/80 p-6 shadow-sm">
        <CaseForm action={createCase} submitLabel="保存案例" />
      </section>
    </PageShell>
  );
}
