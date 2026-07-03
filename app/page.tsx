import Link from "next/link";
import { HeartHandshake, MessageCircleHeart, PenLine } from "lucide-react";
import { HomeLiveTopics } from "@/components/home-live-topics";
import { ButtonLink, PageShell } from "@/components/ui";

const features = [
  {
    icon: PenLine,
    title: "匿名说出问题",
    body: "不暴露身份，也可以把冷战、委屈、异地和安全感问题说出来。",
    href: "/create",
    cta: "去匿名发帖",
  },
  {
    icon: MessageCircleHeart,
    title: "看看过来人的经验",
    body: "不是一句“分了吧”，而是听听别人当时怎么沟通、怎么和好。",
    href: "/posts",
    cta: "去看故事",
  },
  {
    icon: HeartHandshake,
    title: "留下两个人的日常",
    body: "绑定情侣后，可以记录只属于你们的私密心情和小事。",
    href: "/couple",
    cta: "进入私密空间",
  },
];

const reasons = [
  "基础功能免费",
  "不做恋爱军师",
  "不制造性别对立",
  "希望大家分享真实经历和成熟建议",
];

const principles = [
  { label: "真实分享" },
  { label: "温和互助", href: "/posts" },
  { label: "尊重隐私" },
  { label: "不制造对立" },
];

const heroSignals = [
  { label: "基础功能免费" },
  { label: "匿名表达", href: "/create" },
  { label: "真实经验互助", href: "/posts" },
  { label: "帮助情侣好好沟通", href: "/posts" },
];

export default function HomePage() {
  return (
    <PageShell className="pb-16">
      <section className="grid gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-blush-600">免费的情侣互助社区</span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink/58">不做恋爱军师</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-normal text-ink sm:text-6xl">
            给相爱的人，一个好好说话的地方。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink/68 sm:text-lg">
            免费的情侣互助社区。匿名分享恋爱里的误会、冷战、异地和生活小事，也看看别人是怎么走过来的。
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {heroSignals.map((signal) => (
              signal.href ? (
                <Link
                  key={signal.label}
                  href={signal.href}
                  className="rounded-full border border-white bg-white/78 px-3 py-1.5 text-xs font-medium text-ink/68 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-ink"
                >
                  {signal.label}
                </Link>
              ) : (
                <span
                  key={signal.label}
                  className="rounded-full border border-white bg-white/78 px-3 py-1.5 text-xs font-medium text-ink/68 shadow-sm"
                >
                  {signal.label}
                </span>
              )
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/posts">看看大家的故事</ButtonLink>
            <ButtonLink href="/create" variant="light">
              匿名写下心事
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/55">
            不需要把关系说得很糟，才值得被理解。你可以先匿名写下当下的委屈，再慢慢看看别人当时是怎么沟通、怎么和好的。
          </p>
        </div>
        <div className="rounded-[2rem] border border-white bg-white/72 p-6 shadow-soft">
          <div className="rounded-[1.5rem] bg-blush-50 p-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-blush-600">真实帖子示例</p>
              <h2 className="mt-3 text-2xl font-bold">异地恋最近总是冷战，是不是感情淡了？</h2>
              <p className="mt-4 leading-7 text-ink/65">
                我们已经异地快一年了。以前每天都有说不完的话，现在消息越来越少。我不知道是大家都累了，还是我们真的变远了……
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-mint-100 px-3 py-1 text-mint-500">异地恋</span>
                <span className="rounded-full bg-blush-100 px-3 py-1 text-blush-600">冷战</span>
                <span className="rounded-full bg-white px-3 py-1 text-ink/55">匿名</span>
              </div>
              <p className="mt-5 text-xs leading-6 text-ink/46">在这里，大家更关心“后来怎么沟通了”，而不是急着替你下结论。</p>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="group rounded-2xl border border-white bg-white/75 p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
          >
            <feature.icon className="h-7 w-7 text-blush-500" />
            <h2 className="mt-4 font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">{feature.body}</p>
            <p className="mt-4 text-sm font-medium text-blush-600 transition group-hover:text-blush-700">{feature.cta}</p>
          </Link>
        ))}
      </section>
      <HomeLiveTopics />
      <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-2xl border border-white bg-white/76 p-6 shadow-sm sm:p-7">
          <p className="text-sm font-semibold text-blush-600">为什么做这个？</p>
          <h2 className="mt-3 text-2xl font-bold">我们想做一个能让关系慢一点变好的社区</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/62">
            不是教人拿捏伴侣，不是贩卖情绪，也不是一句轻飘飘的判断。这里只保留基础功能免费、匿名表达和经验互助，希望大家带着真实经历来，也带着成熟建议离开。
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {reasons.map((reason) => (
              <div key={reason} className="rounded-2xl bg-blush-50 px-4 py-4 text-sm font-medium text-ink/75">
                {reason}
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-white bg-white/76 p-6 shadow-sm sm:p-7">
          <p className="text-sm font-semibold text-blush-600">社区原则</p>
          <h2 className="mt-3 text-2xl font-bold">每一次表达，都值得被认真接住</h2>
          <div className="mt-6 grid gap-3">
            {principles.map((principle) => (
              principle.href ? (
                <Link
                  key={principle.label}
                  href={principle.href}
                  className="flex items-center gap-3 rounded-2xl border border-blush-100 bg-white px-4 py-4 text-sm font-medium text-ink/74 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-blush-400" />
                  {principle.label}
                </Link>
              ) : (
                <div
                  key={principle.label}
                  className="flex items-center gap-3 rounded-2xl border border-blush-100 bg-white px-4 py-4 text-sm font-medium text-ink/74"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-blush-400" />
                  {principle.label}
                </div>
              )
            ))}
          </div>
        </article>
      </section>
    </PageShell>
  );
}
