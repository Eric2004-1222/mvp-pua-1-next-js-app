import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, MessageCircle, MessageCircleHeart, ShieldCheck } from "lucide-react";
import { AnalyticsEvent, TrackedLink } from "@/components/analytics";
import { CopyScriptButton } from "@/components/copy-script-button";
import { PageShell } from "@/components/ui";
import { analyticsEvents } from "@/lib/analytics";
import { anonymousCases } from "@/lib/cases";
import { getPublishedCaseBySlug, type ManagedCase } from "@/lib/cases-db";

export function generateStaticParams() {
  return anonymousCases.map((item) => ({ slug: item.slug }));
}

function riskClass(level: string) {
  if (level === "高风险") return "bg-rose-100 text-rose-600";
  if (level === "中风险") return "bg-blush-100 text-blush-600";
  return "bg-mint-100 text-mint-600";
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white bg-white/82 p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-ink/64">{children}</div>
    </section>
  );
}

function sourceLabel(sourceType: ManagedCase["sourceType"]) {
  return sourceType === "anonymous_submission" ? "匿名投稿案例" : "编辑整理案例";
}

function buildDiscussionThread(item: ManagedCase) {
  const categoryReplies: Record<string, Array<{ role: string; body: string }>> = {
    冷战: [
      { role: "也经历过", body: "冷战最难受的地方不是没人说话，而是不知道对方到底还想不想靠近。我会先约定一个暂停时间，而不是无限期消失。" },
      { role: "换个角度", body: "有些人沉默不是不在乎，是怕越说越错。但如果完全不解释，另一方确实会越来越没有安全感。" },
    ],
    异地恋: [
      { role: "异地经历", body: "异地里最救命的是可预期感。哪怕不是每天长聊，只要知道什么时候能认真说话，焦虑会少很多。" },
      { role: "提醒一下", body: "不要只看消息数量，也要看对方有没有主动安排见面、有没有把你放进未来计划里。" },
    ],
    边界感: [
      { role: "边界视角", body: "边界不是禁止对方社交，而是两个人一起定义哪些亲密分享会让关系变得不安。" },
      { role: "站在对方", body: "被质疑的人也可能会委屈，所以开口时最好讲自己的感受，不要一上来就定性对方越界。" },
    ],
    吵架沟通: [
      { role: "沟通经验", body: "我觉得吵架时最重要的是一次只说一件事。不然每次都会从小问题变成关系总审判。" },
      { role: "旁观提醒", body: "如果双方都在证明自己更委屈，讨论就会卡住。可以先问：这次我们各自真正想被理解的是什么？" },
    ],
    "分手/复合": [
      { role: "复合视角", body: "复合不是回到以前，而是确认以前的问题有没有新处理方式。只靠想念很容易再次受伤。" },
      { role: "保护自己", body: "关系模糊时要给自己设边界。对方不一定是坏，但你需要知道自己是不是还在单方面投入。" },
    ],
    暧昧关系: [
      { role: "暧昧经历", body: "暧昧期最消耗的是猜。喜欢可以慢慢来，但一直不确认关系，也应该允许自己减少投入。" },
      { role: "温和提问", body: "与其试探对方，不如直接问：你觉得我们是在认真发展，还是只是相处舒服？" },
    ],
  };

  return [
    { role: "楼主补充", body: item.situation },
    ...((categoryReplies[item.category] ?? categoryReplies["吵架沟通"]).slice(0, 2)),
    ...item.discussion.slice(0, 3).map((body) => ({ role: "社区回应", body })),
  ];
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const item = await getPublishedCaseBySlug(resolvedParams.slug);

  if (!item) {
    notFound();
  }

  const discussionThread = buildDiscussionThread(item);

  return (
    <PageShell className="max-w-4xl pb-16">
      <AnalyticsEvent
        eventName={analyticsEvents.caseDetailView}
        properties={{ slug: item.slug, category: item.category, source_type: item.sourceType }}
      />
      <Link href="/cases" className="inline-flex items-center gap-2 text-sm font-medium text-ink/58 transition hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        返回案例库
      </Link>

      <header className="mt-5 rounded-[2rem] border border-white bg-white/76 p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-full bg-white px-3 py-1 text-ink/58 shadow-sm">{item.category}</span>
          <span className="rounded-full bg-blush-50 px-3 py-1 text-blush-600">{sourceLabel(item.sourceType)}</span>
          <span className={`rounded-full px-3 py-1 ${riskClass(item.riskLevel)}`}>{item.riskLevel}</span>
        </div>
        <h1 className="mt-5 text-3xl font-bold leading-tight text-ink sm:text-5xl">{item.title}</h1>
        <p className="mt-4 text-sm leading-7 text-ink/62 sm:text-base">{item.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink/45">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {item.views} 浏览
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            {item.comments} 条讨论
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            匿名化处理
          </span>
        </div>
        <div className="mt-6">
          <TrackedLink
            href="/submit-case"
            eventName={analyticsEvents.caseSubmitCtaClick}
            properties={{ location: "case_detail", slug: item.slug, category: item.category }}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90 sm:w-auto"
          >
            我也想匿名投稿
          </TrackedLink>
        </div>
      </header>

      <div className="mt-6 grid gap-5">
        <section className="rounded-[1.75rem] border border-white bg-white/82 p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blush-600">大家正在怎么聊</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">先看不同视角，再慢慢形成自己的判断</h2>
              <p className="mt-3 text-sm leading-7 text-ink/58">
                这里不是投票站，也不按男生女生站队。前期讨论为编辑生成内容，用来模拟真实社区里的温和互助氛围。
              </p>
            </div>
            <Link
              href="/submit-case"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blush-50 px-4 py-3 text-sm font-semibold text-blush-700 transition hover:bg-white"
            >
              <MessageCircleHeart className="h-4 w-4" />
              我也想说说
            </Link>
          </div>
          <div className="mt-6 grid gap-4">
            {discussionThread.map((reply, index) => (
              <article key={`${reply.role}-${index}`} className="rounded-2xl border border-blush-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-blush-50 px-3 py-1 text-xs font-semibold text-blush-600">{reply.role}</span>
                  <span className="text-xs text-ink/35">{index === 0 ? "刚刚补充" : `${index * 8 + 3} 分钟前`}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-ink/68">{reply.body}</p>
              </article>
            ))}
          </div>
        </section>

        <SectionBlock title="情况描述">
          <p>{item.situation}</p>
        </SectionBlock>

        <SectionBlock title="双方行为">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-blush-50 p-4">
              <p className="text-xs font-semibold text-blush-600">一方的表现</p>
              <p className="mt-2">{item.behaviors.one}</p>
            </div>
            <div className="rounded-2xl bg-mint-100/70 p-4">
              <p className="text-xs font-semibold text-mint-600">另一方的表现</p>
              <p className="mt-2">{item.behaviors.two}</p>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock title="核心矛盾">
          <p>{item.conflict}</p>
        </SectionBlock>

        <SectionBlock title="整理后的旁观者分析">
          <p>{item.analysis}</p>
        </SectionBlock>

        <section className="rounded-[1.75rem] border border-blush-100 bg-blush-50 p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold text-blush-600">讨论后的开口参考</p>
          <h2 className="mt-2 text-xl font-bold text-ink">不是标准答案，只是一个更温和的开场</h2>
          <div className="mt-5 grid gap-4">
            {item.scripts.map((script) => (
              <div key={script} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm leading-7 text-ink/72">“{script}”</p>
                <div className="mt-4 flex justify-end">
                  <CopyScriptButton
                    text={script}
                    analyticsProperties={{ slug: item.slug, category: item.category, source_type: item.sourceType }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionBlock title="更多讨论摘录">
          <div className="grid gap-3">
            {item.discussion.map((line) => (
              <div key={line} className="rounded-2xl bg-white px-4 py-4 text-sm leading-6 text-ink/64 shadow-sm">
                {line}
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>
    </PageShell>
  );
}
