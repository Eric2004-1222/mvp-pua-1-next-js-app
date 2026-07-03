import Link from "next/link";
import { Plus } from "lucide-react";
import { setCaseFeatured, setCaseStatus } from "@/app/admin/actions";
import { AdminNav } from "@/app/admin/admin-nav";
import { PageShell, EmptyState } from "@/components/ui";
import { requireAdmin } from "@/lib/admin";
import { getAdminCases } from "@/lib/cases-db";
import { adminSetupMessage } from "@/lib/supabase/admin";

function statusLabel(status: string) {
  if (status === "published") return "已发布";
  if (status === "archived") return "已下架";
  return "草稿";
}

function sourceLabel(sourceType: string) {
  return sourceType === "anonymous_submission" ? "匿名投稿案例" : "编辑整理案例";
}

export default async function AdminCasesPage({ searchParams }: { searchParams?: Promise<{ message?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const { cases, error } = await getAdminCases();

  return (
    <PageShell className="pb-16">
      <AdminNav />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blush-600">案例管理</p>
          <h1 className="mt-2 text-3xl font-bold">管理案例发布、精选和分类</h1>
        </div>
        <Link
          href="/admin/cases/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft"
        >
          <Plus className="h-4 w-4" />
          新增案例
        </Link>
      </div>

      {params?.message ? <div className="mb-4 rounded-2xl bg-blush-50 p-4 text-sm text-blush-700">{params.message}</div> : null}
      {error === "admin_not_configured" ? <EmptyState title="后台还没配置完成" body={adminSetupMessage} /> : null}
      {error && error !== "admin_not_configured" ? <EmptyState title="读取案例失败" body={error} /> : null}
      {!error && cases.length === 0 ? <EmptyState title="还没有数据库案例" body="可以新增案例，或从投稿详情整理成案例。" /> : null}

      <div className="grid gap-4">
        {cases.map((item) => (
          <article key={item.id} className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full bg-blush-50 px-3 py-1 text-blush-600">{statusLabel(item.status)}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-ink/55 shadow-sm">{item.category}</span>
                  <span className="rounded-full bg-mint-100 px-3 py-1 text-mint-600">{sourceLabel(item.sourceType)}</span>
                  {item.featured ? <span className="rounded-full bg-ink px-3 py-1 text-white">精选</span> : null}
                </div>
                <h2 className="mt-3 text-xl font-bold">{item.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60">{item.summary}</p>
                <p className="mt-3 text-xs text-ink/42">/{item.slug}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm" href={`/admin/cases/${item.id}/edit`}>
                  编辑
                </Link>
                <form action={setCaseStatus.bind(null, item.id!, item.status === "published" ? "archived" : "published")}>
                  <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm" type="submit">
                    {item.status === "published" ? "下架" : "发布"}
                  </button>
                </form>
                <form action={setCaseFeatured.bind(null, item.id!, !item.featured)}>
                  <button className="rounded-full bg-blush-50 px-4 py-2 text-sm font-semibold text-blush-700" type="submit">
                    {item.featured ? "取消精选" : "设为精选"}
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
