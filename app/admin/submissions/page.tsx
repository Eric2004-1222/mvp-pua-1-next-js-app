import Link from "next/link";
import { AdminNav } from "@/app/admin/admin-nav";
import { EmptyState, PageShell } from "@/components/ui";
import { requireAdmin } from "@/lib/admin";
import { getAdminSubmissions } from "@/lib/cases-db";
import { adminSetupMessage } from "@/lib/supabase/admin";

function statusLabel(status: string) {
  if (status === "published") return "已整理";
  if (status === "reviewed") return "已查看";
  if (status === "archived") return "已归档";
  return "待处理";
}

export default async function AdminSubmissionsPage() {
  await requireAdmin();
  const { submissions, error } = await getAdminSubmissions();

  return (
    <PageShell className="pb-16">
      <AdminNav />
      <div className="mb-6">
        <p className="text-sm font-semibold text-blush-600">投稿管理</p>
        <h1 className="mt-2 text-3xl font-bold">查看匿名投稿并整理成案例</h1>
      </div>

      {error === "admin_not_configured" ? <EmptyState title="后台还没配置完成" body={adminSetupMessage} /> : null}
      {error && error !== "admin_not_configured" ? <EmptyState title="读取投稿失败" body={error} /> : null}
      {!error && submissions.length === 0 ? <EmptyState title="还没有投稿" body="用户提交匿名案例后，会出现在这里。" /> : null}

      <div className="grid gap-4">
        {submissions.map((item) => (
          <Link
            key={item.id}
            href={`/admin/submissions/${item.id}`}
            className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full bg-blush-50 px-3 py-1 text-blush-600">{statusLabel(item.status)}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-ink/55 shadow-sm">{item.relationship_status}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-ink/55 shadow-sm">{item.category}</span>
                  <span className="rounded-full bg-mint-100 px-3 py-1 text-mint-600">{item.desired_outcome}</span>
                </div>
                <h2 className="mt-3 text-lg font-bold">匿名投稿</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60">{item.background}</p>
              </div>
              <span className="whitespace-nowrap text-xs text-ink/42">{new Date(item.created_at).toLocaleString("zh-CN")}</span>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
