import Link from "next/link";
import { redirect } from "next/navigation";
import { createDiary } from "@/app/actions";
import { EmptyState, Field, PageShell, inputClass, textareaClass } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { createClient, getSessionUser } from "@/lib/supabase/server";

export default async function CouplePage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const user = await getSessionUser();
  const query = await searchParams;

  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: couple } = await supabase
    .from("couples")
    .select("*")
    .or(`created_by.eq.${user.id},partner_id.eq.${user.id}`)
    .not("partner_id", "is", null)
    .maybeSingle();

  if (!couple) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl rounded-2xl border border-white bg-white/78 p-8 text-center shadow-soft">
          <p className="text-sm font-semibold text-blush-600">情侣私密空间</p>
          <h1 className="mt-3 text-3xl font-bold">先绑定另一半</h1>
          <p className="mt-4 leading-7 text-ink/62">创建邀请码，或输入对方的邀请码。绑定后，两个人可以共同写只属于彼此的日记。</p>
          <Link className="mt-7 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft" href="/couple/bind">
            去绑定
          </Link>
        </div>
      </PageShell>
    );
  }

  const { data: diaries, error } = await supabase
    .from("couple_diaries")
    .select("*")
    .eq("couple_id", couple.id)
    .order("created_at", { ascending: false });

  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-sm font-semibold text-blush-600">情侣私密空间</p>
        <h1 className="mt-2 text-3xl font-bold">两个人的小日记</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">只有绑定关系里的两个人可以查看和书写这里的内容。</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1fr]">
        <section className="h-fit rounded-2xl border border-white bg-white/78 p-6 shadow-soft">
          <h2 className="text-xl font-bold">写一条新的日记</h2>
          <form action={createDiary} className="mt-5 space-y-4">
            <input type="hidden" name="couple_id" value={couple.id} />
            <Field label="今天的心情">
              <input className={inputClass} name="mood" maxLength={20} placeholder="安心、想念、需要抱抱..." />
            </Field>
            <Field label="日记内容">
              <textarea className={textareaClass} name="content" required minLength={2} placeholder="记录今天的一个瞬间，或说一句暂时没说出口的话。" />
            </Field>
            {query.message ? <p className="text-sm text-blush-600">{query.message}</p> : null}
            <button className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft" type="submit">
              保存日记
            </button>
          </form>
        </section>
        <section className="space-y-4">
          {error ? <EmptyState title="日记读取失败" body={error.message} /> : null}
          {!error && diaries?.length === 0 ? <EmptyState title="还没有日记" body="写下第一条属于你们两个人的记录。" /> : null}
          {diaries?.map((diary) => (
            <article key={diary.id} className="rounded-2xl border border-white bg-white/78 p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink/45">
                {diary.mood ? <span className="rounded-full bg-mint-100 px-3 py-1 font-semibold text-mint-500">{diary.mood}</span> : null}
                <span>{diary.author_id === user.id ? "我写的" : "TA 写的"}</span>
                <span className="ml-auto">{formatDate(diary.created_at)}</span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-ink/70">{diary.content}</p>
            </article>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
