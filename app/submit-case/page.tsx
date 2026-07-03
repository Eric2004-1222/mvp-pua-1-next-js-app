import Link from "next/link";
import { Send, ShieldCheck } from "lucide-react";
import { submitCase } from "@/app/actions";
import { AnalyticsEvent } from "@/components/analytics";
import { Field, PageShell, textareaClass } from "@/components/ui";
import { analyticsEvents } from "@/lib/analytics";

const relationshipOptions = ["恋爱中", "异地", "暧昧", "分手后", "复合中"];
const categoryOptions = ["冷战", "异地恋", "边界感", "吵架沟通", "分手复合", "暧昧关系"];
const outcomeOptions = ["和好", "判断谁错", "设边界", "分手", "不确定"];
const displayOptions = ["允许", "不允许"];

function RadioGroup({
  name,
  options,
  defaultValue,
}: {
  name: string;
  options: string[];
  defaultValue: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((option) => (
        <label
          key={option}
          className="has-[:checked]:border-blush-300 has-[:checked]:bg-blush-50 has-[:checked]:text-blush-700 rounded-2xl border border-white bg-white/86 px-3 py-3 text-center text-sm font-medium text-ink/64 shadow-sm transition"
        >
          <input className="sr-only" type="radio" name={name} value={option} required defaultChecked={option === defaultValue} />
          {option}
        </label>
      ))}
    </div>
  );
}

export default async function SubmitCasePage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <PageShell className="max-w-3xl pb-16">
      {params?.success ? <AnalyticsEvent eventName={analyticsEvents.caseSubmissionSuccess} /> : null}
      <section className="rounded-[2rem] border border-white bg-white/76 p-6 shadow-soft sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blush-600">匿名投稿</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">把你的情况说清楚，我们帮它变成可参考的案例。</h1>
            <p className="mt-4 text-sm leading-7 text-ink/62">
              投稿不需要登录，内容默认不公开。编辑只会在匿名化、去隐私信息后，挑选适合的内容整理进案例库。
            </p>
          </div>
          <span className="hidden rounded-full bg-blush-50 p-3 text-blush-600 sm:inline-flex">
            <ShieldCheck className="h-5 w-5" />
          </span>
        </div>

        {params?.success ? (
          <div className="mt-6 rounded-2xl border border-mint-100 bg-mint-100/70 px-4 py-4 text-sm font-medium leading-6 text-mint-600">
            {params.success}
          </div>
        ) : null}

        {params?.message ? (
          <div className="mt-6 rounded-2xl border border-blush-100 bg-blush-50 px-4 py-4 text-sm font-medium leading-6 text-blush-700">
            {params.message}
          </div>
        ) : null}

        <form action={submitCase} className="mt-8 space-y-6">
          <Field label="你们是什么关系">
            <RadioGroup name="relationship_status" options={relationshipOptions} defaultValue="恋爱中" />
          </Field>

          <Field label="问题分类">
            <RadioGroup name="category" options={categoryOptions} defaultValue="冷战" />
          </Field>

          <Field label="这次问题的背景">
            <textarea
              className={textareaClass}
              name="background"
              required
              minLength={10}
              placeholder="比如：最近因为什么事情开始不舒服？发生在什么时候？你们当时怎么沟通的？"
            />
          </Field>

          <Field label="你最委屈的点">
            <textarea
              className={textareaClass}
              name="grievance"
              required
              minLength={6}
              placeholder="可以写你最希望对方理解、但一直没被听见的部分。"
            />
          </Field>

          <Field label="对方的说法或行为">
            <textarea
              className={textareaClass}
              name="partner_behavior"
              required
              minLength={6}
              placeholder="尽量写具体行为或原话，避免只写“他很过分”这种结论。"
            />
          </Field>

          <Field label="你现在想要什么">
            <RadioGroup name="desired_outcome" options={outcomeOptions} defaultValue="不确定" />
          </Field>

          <Field label="是否允许匿名展示">
            <RadioGroup name="allow_anonymous_display" options={displayOptions} defaultValue="允许" />
          </Field>

          <div className="rounded-2xl bg-blush-50 px-4 py-4 text-xs leading-6 text-ink/54">
            请不要填写真实姓名、手机号、微信号、住址等可识别信息。即使选择允许展示，内容也会先做匿名整理，不会原文直接公开。
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90"
              type="submit"
            >
              <Send className="h-4 w-4" />
              提交匿名案例
            </button>
            <Link
              href="/cases"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-blush-50"
            >
              先看看案例库
            </Link>
          </div>
        </form>
      </section>
    </PageShell>
  );
}
