import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCase } from "@/app/admin/actions";
import { AdminNav } from "@/app/admin/admin-nav";
import { CaseForm } from "@/app/admin/case-form";
import { EmptyState, PageShell } from "@/components/ui";
import { requireAdmin } from "@/lib/admin";
import { getAdminCaseById } from "@/lib/cases-db";
import { adminSetupMessage } from "@/lib/supabase/admin";

export default async function EditCasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ message?: string }>;
}) {
  await requireAdmin();
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const { caseItem, error } = await getAdminCaseById(id);

  if (!caseItem && !error) {
    notFound();
  }

  return (
    <PageShell className="pb-16">
      <AdminNav />
      <div className="mb-6">
        <Link href="/admin/cases" className="text-sm font-medium text-ink/55 transition hover:text-ink">
          返回案例管理
        </Link>
        <h1 className="mt-3 text-3xl font-bold">编辑案例</h1>
        {resolvedSearchParams?.message ? (
          <p className="mt-3 rounded-2xl bg-blush-50 p-4 text-sm text-blush-700">{resolvedSearchParams.message}</p>
        ) : null}
      </div>

      {error === "admin_not_configured" ? <EmptyState title="后台还没配置完成" body={adminSetupMessage} /> : null}
      {error && error !== "admin_not_configured" ? <EmptyState title="读取案例失败" body={error} /> : null}

      {caseItem ? (
        <section className="rounded-2xl border border-white bg-white/80 p-6 shadow-sm">
          <CaseForm action={updateCase.bind(null, id)} submitLabel="保存修改" caseItem={caseItem} />
        </section>
      ) : null}
    </PageShell>
  );
}
