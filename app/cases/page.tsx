import Link from "next/link";
import { Eye, MessageCircle, Sparkles } from "lucide-react";
import { AnalyticsEvent, TrackedLink } from "@/components/analytics";
import { PageShell } from "@/components/ui";
import { analyticsEvents } from "@/lib/analytics";
import { caseCategories } from "@/lib/cases";
import { getFeaturedCases, getPublishedCases, type ManagedCase } from "@/lib/cases-db";

function formatCount(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;
}

function riskClass(level: string) {
  if (level === "高风险") return "bg-rose-100 text-rose-600";
  if (level === "中风险") return "bg-blush-100 text-blush-600";
  return "bg-mint-100 text-mint-600";
}

function sourceLabel(sourceType: ManagedCase["sourceType"]) {
  return sourceType === "anonymous_submission" ? "匿名投稿案例" : "编辑整理案例";
}

function CaseCard({ item, compact = false }: { item: ManagedCase; compact?: boolean }) {
  return (
    <article className="rounded-2xl border border-white bg-white/82 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        <span className="rounded-full bg-white px-3 py-1 text-ink/58 shadow-sm">{item.category}</span>
        <span className="rounded-full bg-blush-50 px-3 py-1 text-blush-600">{sourceLabel(item.sourceType)}</span>
        <span className={`rounded-full px-3 py-1 ${riskClass(item.riskLevel)}`}>{item.riskLevel}</span>
      </div>
      <h2 className={compact ? "mt-4 text-lg font-bold leading-7" : "mt-4 text-xl font-bold leading-8"}>{item.title}</h2>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink/62">{item.summary}</p>
      <div className="mt-5 flex items-center gap-4 text-xs text-ink/45">
        <span className="inline-flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          {formatCount(item.views)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" />
          {item.comments}
        </span>
      </div>
      <Link
        href={`/cases/${item.slug}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
      >
        查看分析
      </Link>
    </article>
  );
}

export default async function CasesPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams?.category ?? "全部";
  const cases = await getPublishedCases(activeCategory);
  const featuredCases = await getFeaturedCases();
  const latestCases = cases.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <PageShell className="pb-16">
      <AnalyticsEvent eventName={analyticsEvents.casesPageView} properties={{ category: activeCategory }} />
      <section className="rounded-[2rem] border border-white bg-white/74 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-3xl flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-blush-600">
              <Sparkles className="h-3.5 w-3.5" />
              匿名案例库
            </span>
            <h1 className="text-3xl font-bold leading-tight text-ink sm:text-5xl">把复杂的感情问题，拆开看清楚一点。</h1>
            <p className="text-sm leading-7 text-ink/62 sm:text-base">
              这里收录编辑整理后的匿名案例，用更轻、更清楚的方式看见冷战、异地、边界和沟通问题。先看案例，再决定自己要怎么说。
            </p>
          </div>
          <div className="shrink-0">
            <TrackedLink
              href="/submit-case"
              eventName={analyticsEvents.caseSubmitCtaClick}
              properties={{ location: "cases_hero" }}
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90"
            >
              匿名投稿
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {["全部", ...caseCategories].map((category) => {
          const isActive = category === activeCategory;
          const href = category === "全部" ? "/cases" : `/cases?category=${encodeURIComponent(category)}`;

          return (
            <TrackedLink
              key={category}
              href={href}
              eventName={analyticsEvents.caseCategoryClick}
              properties={{ category }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium shadow-sm transition ${
                isActive ? "bg-ink text-white" : "bg-white/85 text-ink/68 hover:bg-white hover:text-ink"
              }`}
            >
              {category}
            </TrackedLink>
          );
        })}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blush-600">精选案例</p>
            <h2 className="mt-1 text-2xl font-bold">先看这几个高频关系难题</h2>
          </div>
          <span className="hidden rounded-full bg-white/80 px-3 py-1 text-xs text-ink/45 sm:inline-flex">编辑整理，不代表专业咨询</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredCases.map((item) => (
            <CaseCard key={item.slug} item={item} compact />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <p className="text-sm font-semibold text-blush-600">最新案例</p>
          <h2 className="mt-1 text-2xl font-bold">{activeCategory === "全部" ? "最近整理的匿名关系案例" : `${activeCategory}相关案例`}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestCases.map((item) => (
            <CaseCard key={item.slug} item={item} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
