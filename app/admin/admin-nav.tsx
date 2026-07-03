import Link from "next/link";
import { adminSignOut } from "@/app/admin/actions";

export function AdminNav() {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white bg-white/76 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <Link className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" href="/admin/cases">
          案例管理
        </Link>
        <Link className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm" href="/admin/submissions">
          投稿管理
        </Link>
        <Link className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm" href="/admin/analytics">
          数据统计
        </Link>
        <Link className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm" href="/cases">
          查看前台
        </Link>
      </div>
      <form action={adminSignOut}>
        <button className="rounded-full bg-blush-50 px-4 py-2 text-sm font-semibold text-blush-600" type="submit">
          退出后台
        </button>
      </form>
    </div>
  );
}
