import Link from "next/link";
import { PageShell } from "@/components/ui";

export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-xl rounded-2xl border border-white bg-white/78 p-8 text-center shadow-soft">
        <h1 className="text-3xl font-bold">没有找到这页</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">可能是帖子不存在，或链接已经失效。</p>
        <Link href="/posts" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
          回到社区
        </Link>
      </div>
    </PageShell>
  );
}
