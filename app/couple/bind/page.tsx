import { redirect } from "next/navigation";
import { bindInvite, createInvite } from "@/app/actions";
import { Field, PageShell, inputClass } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { createClient, getSessionUser } from "@/lib/supabase/server";

export default async function CoupleBindPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const user = await getSessionUser();
  const query = await searchParams;

  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: myInvites } = await supabase
    .from("couples")
    .select("*")
    .eq("created_by", user.id)
    .is("partner_id", null)
    .order("created_at", { ascending: false });

  const { data: boundCouple } = await supabase
    .from("couples")
    .select("*")
    .or(`created_by.eq.${user.id},partner_id.eq.${user.id}`)
    .not("partner_id", "is", null)
    .maybeSingle();

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blush-600">情侣绑定</p>
          <h1 className="mt-2 text-3xl font-bold">创建或输入情侣邀请码</h1>
          <p className="mt-3 text-sm leading-6 text-ink/60">绑定成功后，情侣日记会被 RLS 策略限制为你们两个人可见。</p>
        </div>
        {boundCouple ? (
          <div className="mb-6 rounded-2xl border border-mint-200 bg-mint-50 p-5 text-sm text-ink/70">
            你已经完成绑定，可以进入 <a className="font-semibold text-mint-500 underline" href="/couple">情侣私密空间</a>。
          </div>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-white bg-white/78 p-6 shadow-soft">
            <h2 className="text-xl font-bold">我来创建邀请码</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">生成后发给另一半，对方登录后输入即可绑定。</p>
            <form action={createInvite} className="mt-6">
              <button className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft" type="submit">
                生成邀请码
              </button>
            </form>
            <div className="mt-6 space-y-3">
              {myInvites?.map((invite) => (
                <div key={invite.id} className="rounded-2xl bg-blush-50 p-4">
                  <p className="text-xs text-ink/45">创建于 {formatDate(invite.created_at)}</p>
                  <p className="mt-2 font-mono text-2xl font-bold tracking-widest text-blush-600">{invite.invite_code}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-white bg-white/78 p-6 shadow-soft">
            <h2 className="text-xl font-bold">我有邀请码</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">输入对方给你的 8 位邀请码，建立情侣绑定关系。</p>
            <form action={bindInvite} className="mt-6 space-y-4">
              <Field label="邀请码">
                <input className={inputClass + " uppercase tracking-widest"} name="invite_code" required minLength={6} maxLength={12} placeholder="ABCD2345" />
              </Field>
              {query.message ? <p className="text-sm text-blush-600">{query.message}</p> : null}
              <button className="rounded-full bg-blush-500 px-5 py-3 text-sm font-semibold text-white shadow-soft" type="submit">
                绑定
              </button>
            </form>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
