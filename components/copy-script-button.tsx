"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { trackEvent } from "@/components/analytics";
import { analyticsEvents, type AnalyticsProperties } from "@/lib/analytics";

export function CopyScriptButton({ text, analyticsProperties }: { text: string; analyticsProperties?: AnalyticsProperties }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    trackEvent(analyticsEvents.caseScriptCopy, analyticsProperties);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-ink/90"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "已复制" : "复制话术"}
    </button>
  );
}
