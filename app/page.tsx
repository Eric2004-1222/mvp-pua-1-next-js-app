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
  "这个网站的基础功能会保持免费。",
  "我不是想做恋爱军师，也不想制造性别对立。",
  "只是希望情侣在冷战、误会、异地和委屈里，多一个可以认真表达、互相理解的地方。",
  "也希望经历更成熟的人，愿意留下自己的经验，帮到正在迷茫的人。",
];

const principles = [
  { label: "真实分享" },
  { label: "温和互助", href: "/posts" },
  { label: "尊重隐私" },
  { label: "不制造对立" },
];

export default function HomePage() {
  return (
    <PageShell className="pb-20">
      <section className="grid gap-8 py-10 md:gap-10 lg:min-h-[68vh] lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:py-16">
        <div className="max-w-2xl">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
            给相爱的人，一个好好说话的地方。
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink/68 sm:text-lg sm:leading-8">
            一个免费的情侣互助社区。匿名分享恋爱里的误会、冷战、异地和生活小事，也看看别人是怎么走过来的。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/posts">看看大家的故事</ButtonLink>
            <ButtonLink href="/create" variant="light">
              匿名写下心事
            </ButtonLink>
          </div>
        </div>
        <div className="order-last lg:order-none">
          <article className="mx-auto max-w-md rounded-[2rem] border border-white/90 bg-white/78 p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-blush-600">今日心事</span>
              <span className="text-xs text-ink/42">刚刚更新</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold leading-8 text-ink sm:text-2xl">
              异地恋最近总是冷战，是不是感情淡了？
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink/64 sm:text-base">
              我们已经异地快一年了。以前每天都有说不完的话，现在消息越来越少。我不知道是大家都累了，还是我们真的变远了……
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded-full bg-mint-100 px-3 py-1 text-mint-500">异地恋</span>
              <span className="rounded-full bg-blush-100 px-3 py-1 text-blush-600">冷战</span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-ink/55">匿名</span>
            </div>
          </article>
        </div>
      </section>

      <section className="mt-2 rounded-[2rem] border border-white bg-white/76 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blush-600">为什么做这个？</p>
        <h2 className="mt-3 text-2xl font-bold">希望关系里的委屈和误会，能多一个被认真接住的地方</h2>
        <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-ink/64 sm:text-base">
          {reasons.map((reason) => (
            <p key={reason}>{reason}</p>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-blush-600">你可以在这里做什么？</p>
          <h2 className="mt-3 text-2xl font-bold">先看看别人的故事，或者慢慢写下自己的心事</h2>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="group rounded-2xl border border-white bg-white/75 p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-soft"
          >
            <feature.icon className="h-7 w-7 text-blush-500" />
            <h2 className="mt-4 font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">{feature.body}</p>
            <p className="mt-4 text-sm font-medium text-blush-600 transition group-hover:text-blush-700">{feature.cta}</p>
          </Link>
        ))}
      </section>

      <section className="mt-12 rounded-[2rem] border border-white bg-white/76 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blush-600">社区原则</p>
        <h2 className="mt-3 text-2xl font-bold">希望每一次表达，都能被温和地回应</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {principles.map((principle) =>
            principle.href ? (
              <Link
                key={principle.label}
                href={principle.href}
                className="inline-flex items-center gap-2 rounded-full border border-blush-100 bg-white px-4 py-3 text-sm font-medium text-ink/74 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-blush-400" />
                {principle.label}
              </Link>
            ) : (
              <div
                key={principle.label}
                className="inline-flex items-center gap-2 rounded-full border border-blush-100 bg-white px-4 py-3 text-sm font-medium text-ink/74"
              >
                <span className="h-2 w-2 rounded-full bg-blush-400" />
                {principle.label}
              </div>
            ),
          )}
        </div>
      </section>

      <HomeLiveTopics />
    </PageShell>
  );
}
