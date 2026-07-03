import type { Metadata } from "next";
import Link from "next/link";
import { Heart, LogOut } from "lucide-react";
import { getSessionUser } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { signOut } from "@/app/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "心事小屋 | 情侣互助社区",
  description: "面向年轻情侣的温和互助社区 MVP",
};

const navItems = [
  { href: "/cases", label: "案例库" },
  { href: "/posts", label: "故事广场" },
  { href: "/create", label: "写下心事" },
  { href: "/couple", label: "私密空间" },
];

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const config = getSupabaseConfig();
  const user = config.isConfigured ? await getSessionUser() : null;

  return (
    <html lang="zh-CN">
      <body className="text-ink antialiased">
        <header className="sticky top-0 z-30 border-b border-white/80 bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blush-100 text-blush-600">
                <Heart className="h-5 w-5" fill="currentColor" />
              </span>
              心事小屋
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-white hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {user ? (
                <form action={signOut}>
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-blush-100 bg-white px-4 py-2 text-sm font-medium text-ink/75 shadow-sm transition hover:border-blush-200 hover:text-ink"
                    type="submit"
                  >
                    <LogOut className="h-4 w-4" />
                    退出
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-ink/90"
                >
                  登录
                </Link>
              )}
            </div>
          </div>
          <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-ink/70"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
