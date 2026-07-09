"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircleHeart, RefreshCw } from "lucide-react";

const liveTopics = [
  {
    title: "见家长前突然开始焦虑，是我想太多吗？",
    meta: "13 分钟前 · 7 条回应",
    body: "本来已经说好这个周末见面，但越临近越紧张，怕自己表现不好，也怕对方家里觉得我不够成熟。",
    tags: ["见家长", "焦虑", "匿名"],
    href: "/cases/parents-boundary-too-involved",
  },
  {
    title: "同居以后总因为小事不开心，到底该怎么分工？",
    meta: "28 分钟前 · 11 条回应",
    body: "以前觉得住在一起会更甜，现在才发现洗碗、做饭、作息不同这些事，真的会一点点磨掉耐心。",
    tags: ["同居", "生活琐事", "沟通"],
    href: "/cases/apology-but-no-change",
  },
  {
    title: "消费观差太多，还能继续往下走吗？",
    meta: "52 分钟前 · 9 条回应",
    body: "我更看重存钱和计划，他觉得开心最重要。最近每次聊到花钱都变得很别扭，我不知道这是习惯问题还是价值观问题。",
    tags: ["消费观", "矛盾", "真实经历"],
    href: "/cases?category=%E5%90%B5%E6%9E%B6%E6%B2%9F%E9%80%9A",
  },
  {
    title: "异地恋最近总是冷战，是不是感情淡了？",
    meta: "刚刚 · 18 条回应",
    body: "我们已经异地快一年了。以前每天都有说不完的话，现在消息越来越少，我不知道是大家都累了，还是我们真的变远了。",
    tags: ["异地恋", "冷战", "匿名"],
    href: "/cases/long-distance-cold-war-less-messages",
  },
  {
    title: "对象和同事聊天很频繁，我说出来会不会显得小气？",
    meta: "6 分钟前 · 14 条回应",
    body: "他们几乎每天都会聊生活里的小事。我知道不一定有什么，但我心里还是有点不舒服，也怕自己太敏感。",
    tags: ["边界感", "安全感", "匿名"],
    href: "/cases/partner-too-close-with-colleague",
  },
  {
    title: "每次吵架都会翻旧账，我们是不是不会沟通？",
    meta: "19 分钟前 · 21 条回应",
    body: "明明一开始只是很小的事，最后都会变成过去所有委屈一起爆发。吵完以后两个人都很累。",
    tags: ["吵架沟通", "翻旧账", "真实经历"],
    href: "/cases/fight-always-becomes-old-accounts",
  },
  {
    title: "暧昧三个月还不确定关系，我还要继续等吗？",
    meta: "36 分钟前 · 16 条回应",
    body: "相处起来很像情侣，但每次聊到关系，对方都说顺其自然。我不知道自己是在被认真对待，还是只是在自我感动。",
    tags: ["暧昧关系", "不确定", "匿名"],
    href: "/cases/ambiguous-but-no-confirmation",
  },
  {
    title: "说了分手但还每天联系，这样到底算什么？",
    meta: "48 分钟前 · 24 条回应",
    body: "我们没有正式复合，但还是会分享日常。我一边觉得有希望，一边又怕自己只是放不下。",
    tags: ["分手/复合", "关系模糊", "匿名"],
    href: "/cases/breakup-then-still-contacting",
  },
  {
    title: "他下班后只想安静，我总觉得自己被冷落",
    meta: "1 小时前 · 10 条回应",
    body: "我想和他聊聊今天发生的事，但他经常说太累了。理智上我理解，情绪上还是会有点难过。",
    tags: ["冷战", "陪伴需求", "沟通"],
    href: "/cases/boyfriend-needs-space-after-work",
  },
];

const replyMood = [
  "有人分享了异地和好的方法",
  "有人认真讲了同居后的分工磨合",
  "也有人只是说：先抱抱你，再慢慢聊",
];

function visibleTopics(offset: number) {
  return [0, 1, 2].map((index) => liveTopics[(offset + index) % liveTopics.length]);
}

export function HomeLiveTopics() {
  const [offset, setOffset] = useState(0);
  const topics = visibleTopics(offset);

  return (
    <section className="mt-12 rounded-[2rem] border border-white bg-white/74 p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blush-600">此刻大家正在聊</p>
          <h2 className="mt-2 text-2xl font-bold">这里不是空白页面，而是真的有人在认真讨论关系里的小事</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/60">
            有人讲异地怎么和好，有人聊同居后怎么重新分工，也有人只是先说一句“抱抱你”。你可以先看看，再决定要不要开口。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOffset((value) => (value + 3) % liveTopics.length)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blush-50 px-4 py-3 text-sm font-semibold text-ink/68 transition hover:bg-white hover:text-ink"
        >
          <RefreshCw className="h-4 w-4" />
          换一批
        </button>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_0.78fr]">
        <div className="grid gap-4">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="group rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="max-w-2xl text-lg font-semibold leading-7 text-ink">{topic.title}</h3>
                <span className="whitespace-nowrap text-xs text-ink/42">{topic.meta}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-ink/62">{topic.body}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {topic.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-600">
                    {tag}
                  </span>
                ))}
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-ink/45 transition group-hover:text-blush-600">
                  <MessageCircleHeart className="h-4 w-4" />
                  进入讨论
                </span>
              </div>
            </Link>
          ))}
        </div>
        <aside className="rounded-[1.75rem] bg-blush-50 p-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-blush-600">回应通常是什么样？</p>
            <div className="mt-4 space-y-3">
              {replyMood.map((item) => (
                <div key={item} className="rounded-2xl border border-blush-100 bg-white px-4 py-4 text-sm leading-6 text-ink/68">
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/cases"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              看看更多真实讨论
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
