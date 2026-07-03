import Link from "next/link";
import { MessageCircle, PenLine } from "lucide-react";
import { ButtonLink, EmptyState, PageShell, Tag } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

  return (
    <PageShell>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blush-600">社区广场</p>
          <h1 className="mt-2 text-3xl font-bold">大家正在聊什么</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">
            用温和的方式分享亲密关系里的真实经历。所有建议都只是经验，不替代专业咨询。
          </p>
        </div>
        <ButtonLink href="/create">
          <PenLine className="mr-2 h-4 w-4" />
          发布心事
        </ButtonLink>
      </div>

      {error ? <EmptyState title="读取失败" body={error.message} /> : null}
      {!error && posts?.length === 0 ? <EmptyState title="还没有帖子" body="成为第一个分享心事的人吧。" /> : null}

      <div className="grid gap-4">
        {posts?.map((post) => (
          <Link
            href={`/posts/${post.id}`}
            key={post.id}
            className="rounded-2xl border border-white bg-white/78 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/62">{post.content}</p>
              </div>
              <span className="whitespace-nowrap text-xs text-ink/45">{formatDate(post.created_at)}</span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {(post.tags as string[]).map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              {post.is_anonymous ? <span className="rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-600">匿名</span> : null}
              <span className="ml-auto inline-flex items-center gap-1 text-xs text-ink/45">
                <MessageCircle className="h-4 w-4" />
                查看回应
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
