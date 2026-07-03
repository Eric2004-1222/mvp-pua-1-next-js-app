import Link from "next/link";
import { clsx } from "clsx";

export function PageShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <main className={clsx("mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12", className)}>{children}</main>;
}

export function ButtonLink({
  href,
  children,
  variant = "dark",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light";
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
        variant === "dark" ? "bg-ink text-white shadow-soft hover:bg-ink/90" : "bg-white text-ink shadow-sm hover:bg-blush-50",
      )}
    >
      {children}
    </Link>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-ink/80">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-ink/50">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "focus-soft w-full rounded-2xl border border-blush-100 bg-white/90 px-4 py-3 text-sm text-ink shadow-sm placeholder:text-ink/35";

export const textareaClass =
  "focus-soft min-h-40 w-full resize-y rounded-2xl border border-blush-100 bg-white/90 px-4 py-3 text-sm leading-7 text-ink shadow-sm placeholder:text-ink/35";

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-medium text-mint-500">{children}</span>;
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-blush-200 bg-white/70 p-8 text-center">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink/60">{body}</p>
    </div>
  );
}
