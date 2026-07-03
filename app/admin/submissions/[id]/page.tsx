import Link from "next/link";
import { notFound } from "next/navigation";
import { createCaseFromSubmission } from "@/app/admin/actions";
import { AdminNav } from "@/app/admin/admin-nav";
import { CaseForm } from "@/app/admin/case-form";
import { EmptyState, PageShell } from "@/components/ui";
import { requireAdmin } from "@/lib/admin";
import { getAdminSubmissionById, type ManagedCase } from "@/lib/cases-db";
import { adminSetupMessage } from "@/lib/supabase/admin";

function normalizeCategory(category: string) {
  return category === "分手复合" ? "分手/复合" : category;
}

function buildDraftCase(submission: NonNullable<Awaited<ReturnType<typeof getAdminSubmissionById>>["submission"]>): Partial<ManagedCase> {
  return {
    title: `${submission.category}里的关系问题：需要怎么沟通？`,
    category: normalizeCategory(submission.category) as ManagedCase["category"],
    sourceType: "anonymous_submission",
    riskLevel: "中风险",
    status: "draft",
    featured: false,
    views: 0,
    comments: 0,
    summary: submission.background.slice(0, 90),
    situation: submission.background,
    behaviors: {
      one: submission.grievance,
      two: submission.partner_behavior,
    },
    conflict: `投稿者现在想要：${submission.desired_outcome}。核心矛盾需要进一步整理。`,
    analysis: "这里写旁观者分析：先区分事实、感受和需求，再给出温和可执行的沟通方向。",
    scripts: ["我想把这件事说清楚，不是为了争输赢，而是想让我们都知道彼此真正难受的地方。"],
    discussion: ["这是一条来自匿名投稿的待整理案例。"],
  };
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-blush-600">{title}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ink/66">{body}</p>
    </div>
  );
}

export default async function SubmissionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ message?: string }>;
}) {
  await requireAdmin();
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const { submission, error } = await getAdminSubmissionById(id);

  if (!submission && !error) {
    notFound();
  }

  const draftCase = submission ? buildDraftCase(submission) : undefined;

  return (
    <PageShell className="pb-16">
      <AdminNav />
      <div className="mb-6">
        <Link href="/admin/submissions" className="text-sm font-medium text-ink/55 transition hover:text-ink">
          返回投稿管理
        </Link>
        <h1 className="mt-3 text-3xl font-bold">投稿详情</h1>
        {resolvedSearchParams?.message ? (
          <p className="mt-3 rounded-2xl bg-blush-50 p-4 text-sm text-blush-700">{resolvedSearchParams.message}</p>
        ) : null}
      </div>

      {error === "admin_not_configured" ? <EmptyState title="后台还没配置完成" body={adminSetupMessage} /> : null}
      {error && error !== "admin_not_configured" ? <EmptyState title="读取投稿失败" body={error} /> : null}

      {submission ? (
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <section className="rounded-2xl border border-white bg-blush-50 p-5 shadow-sm">
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded-full bg-white px-3 py-1 text-ink/60">{submission.relationship_status}</span>
              <span className="rounded-full bg-white px-3 py-1 text-ink/60">{submission.category}</span>
              <span className="rounded-full bg-white px-3 py-1 text-ink/60">{submission.desired_outcome}</span>
              <span className="rounded-full bg-mint-100 px-3 py-1 text-mint-600">
                {submission.allow_anonymous_display ? "允许匿名展示" : "不允许展示"}
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              <InfoBlock title="这次问题的背景" body={submission.background} />
              <InfoBlock title="最委屈的点" body={submission.grievance} />
              <InfoBlock title="对方的说法或行为" body={submission.partner_behavior} />
            </div>
          </section>

          <section className="rounded-2xl border border-white bg-white/80 p-6 shadow-sm">
            <p className="text-sm font-semibold text-blush-600">整理成案例</p>
            <h2 className="mt-2 text-2xl font-bold">编辑后保存为案例</h2>
            <p className="mt-3 text-sm leading-6 text-ink/55">下面已经根据投稿预填了一版草稿，你可以修改标题、分类、分析和话术后保存。</p>
            <div className="mt-6">
              <CaseForm action={createCaseFromSubmission} submitLabel="保存为案例" caseItem={draftCase} sourceSubmissionId={submission.id} />
            </div>
          </section>
        </div>
      ) : null}
    </PageShell>
  );
}
