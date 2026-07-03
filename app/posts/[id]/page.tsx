import { notFound } from "next/navigation";
import { createComment } from "@/app/actions";
import { EmptyState, Field, PageShell, Tag, textareaClass } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { createClient, getSessionUser } from "@/lib/supabase/server";
import type { CommentKind } from "@/lib/types";

const kindLabels: Record<CommentKind, string> = {
  same_experience: "我们也经历过",
  advice: "我的建议是",
  hug: "抱抱你",
};

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const user = await getSessionUser();
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!post) notFound();

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const commentAction = createComment.bind(null, id);

  return (
    <PageShell>
      <article className="rounded-2xl border border-white bg-white/82 p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          {(post.tags as string[]).map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {post.is_anonymous ? <span className="rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-600">匿名</span> : null}
          <span className="ml-auto text-xs text-ink/45">{formatDate(post.created_at)}</span>
        </div>
        <h1 className="mt-5 text-3xl font-bold leading-tight">{post.title}</h1>
        <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-ink/72">{post.content}</p>
      </article>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.82fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">温柔回应</h2>
          {error ? <EmptyState title="评论读取失败" body={error.message} /> : null}
          {!error && comments?.length === 0 ? <EmptyState title="还没有回应" body="用一句经验或拥抱，接住这份心事。" /> : null}
          {comments?.map((comment) => (
            <article key={comment.id} className="rounded-2xl border border-white bg-white/75 p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-blush-100 px-3 py-1 font-semibold text-blush-600">{kindLabels[comment.kind as CommentKind]}</span>
                {comment.is_anonymous ? <span className="text-ink/45">匿名用户</span> : <span className="text-ink/45">社区用户</span>}
                <span className="ml-auto text-ink/40">{formatDate(comment.created_at)}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink/70">{comment.content}</p>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border border-white bg-white/78 p-6 shadow-soft">
          <h2 className="text-xl font-bold">写回应</h2>
          {user ? (
            <form action={commentAction} className="mt-5 space-y-4">
              <Field label="回应类型">
                <select className="focus-soft w-full rounded-2xl border border-blush-100 bg-white px-4 py-3 text-sm shadow-sm" name="kind" defaultValue="hug">
                  {Object.entries(kindLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="内容">
                <textarea className={textareaClass} name="content" required minLength={2} placeholder="分享你的经历、建议，或者给 TA 一个温柔的回应。" />
              </Field>
              <label className="flex items-center gap-3 text-sm text-ink/65">
                <input name="is_anonymous" type="checkbox" className="h-4 w-4 accent-blush-500" defaultChecked />
                匿名回应
              </label>
              {query.message ? <p className="text-sm text-blush-600">{query.message}</p> : null}
              <button className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft" type="submit">
                发送回应
              </button>
            </form>
          ) : (
            <p className="mt-4 rounded-2xl bg-blush-50 p-4 text-sm leading-6 text-ink/65">登录后可以评论，避免社区被打扰。</p>
          )}
        </aside>
      </section>
    </PageShell>
  );
}
