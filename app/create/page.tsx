import { redirect } from "next/navigation";
import { createPost } from "@/app/actions";
import { Field, PageShell, inputClass, textareaClass } from "@/components/ui";
import { getSessionUser } from "@/lib/supabase/server";

export default async function CreatePage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const user = await getSessionUser();
  const params = await searchParams;

  if (!user) redirect("/login");

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl rounded-2xl border border-white bg-white/78 p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold text-blush-600">发布帖子</p>
        <h1 className="mt-2 text-3xl font-bold">写下你的情侣故事或问题</h1>
        <form action={createPost} className="mt-8 space-y-5">
          <Field label="标题">
            <input className={inputClass} name="title" required maxLength={80} placeholder="比如：冷战三天后该怎么开口？" />
          </Field>
          <Field label="内容">
            <textarea className={textareaClass} name="content" required minLength={10} placeholder="尽量描述具体情境、你的感受和你想得到的经验分享。" />
          </Field>
          <Field label="标签" hint="用空格或逗号分隔，最多保存 6 个。">
            <input className={inputClass} name="tags" placeholder="异地恋 冷战 消费观" />
          </Field>
          <label className="flex items-center gap-3 rounded-2xl bg-blush-50 px-4 py-3 text-sm text-ink/70">
            <input name="is_anonymous" type="checkbox" className="h-4 w-4 accent-blush-500" defaultChecked />
            匿名发布
          </label>
          {params.message ? <p className="text-sm text-blush-600">{params.message}</p> : null}
          <button className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft" type="submit">
            发布
          </button>
        </form>
      </div>
    </PageShell>
  );
}
