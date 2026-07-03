import { AdminNav } from "@/app/admin/admin-nav";
import { EmptyState, PageShell } from "@/components/ui";
import { analyticsEvents } from "@/lib/analytics";
import { getAnalyticsSummary } from "@/lib/analytics-db";
import { requireAdmin } from "@/lib/admin";
import { adminSetupMessage } from "@/lib/supabase/admin";

const totalCards = [
  { event: analyticsEvents.casesPageView, label: "/cases 页面访问量" },
  { event: analyticsEvents.caseCategoryClick, label: "分类点击次数" },
  { event: analyticsEvents.caseDetailView, label: "案例详情页访问量" },
  { event: analyticsEvents.caseScriptCopy, label: "建议话术复制次数" },
  { event: analyticsEvents.caseSubmitCtaClick, label: "匿名投稿按钮点击次数" },
  { event: analyticsEvents.caseSubmissionSuccess, label: "投稿成功次数" },
];

function RankingList({ title, items }: { title: string; items: Array<{ label: string; count: number }> }) {
  return (
    <section className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm">
      <h2 className="font-bold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl bg-blush-50 px-4 py-3 text-sm">
              <span className="truncate text-ink/68">{item.label}</span>
              <span className="font-semibold text-ink">{item.count}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-ink/45">暂无数据</p>
        )}
      </div>
    </section>
  );
}

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const { summary, error } = await getAnalyticsSummary();

  return (
    <PageShell className="pb-16">
      <AdminNav />
      <div className="mb-6">
        <p className="text-sm font-semibold text-blush-600">数据统计</p>
        <h1 className="mt-2 text-3xl font-bold">匿名案例库基础数据</h1>
        <p className="mt-3 text-sm leading-6 text-ink/55">统计来自 Supabase 的 analytics_events 表，当前页面最多汇总最近 5000 条事件。</p>
      </div>

      {error === "admin_not_configured" ? <EmptyState title="后台还没配置完成" body={adminSetupMessage} /> : null}
      {error && error !== "admin_not_configured" ? <EmptyState title="读取统计失败" body={error} /> : null}

      {summary ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {totalCards.map((card) => (
              <article key={card.event} className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm">
                <p className="text-sm text-ink/52">{card.label}</p>
                <p className="mt-3 text-3xl font-bold text-ink">{summary.totals[card.event]}</p>
                <p className="mt-2 text-xs text-ink/38">{card.event}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            <RankingList title="分类点击排行" items={summary.categories} />
            <RankingList title="案例访问排行" items={summary.caseViews} />
            <RankingList title="话术复制排行" items={summary.scriptCopies} />
            <RankingList title="投稿入口点击位置" items={summary.ctaLocations} />
          </section>

          <section className="mt-6 rounded-2xl border border-white bg-white/80 p-5 shadow-sm">
            <h2 className="font-bold">最近事件</h2>
            <div className="mt-4 grid gap-2">
              {summary.recentEvents.map((event, index) => (
                <div key={`${event.created_at}-${index}`} className="rounded-2xl bg-blush-50 px-4 py-3 text-xs leading-5 text-ink/62">
                  <span className="font-semibold text-ink">{event.event_name}</span>
                  <span className="mx-2 text-ink/30">/</span>
                  <span>{event.path ?? "-"}</span>
                  <span className="mx-2 text-ink/30">/</span>
                  <span>{new Date(event.created_at).toLocaleString("zh-CN")}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </PageShell>
  );
}
