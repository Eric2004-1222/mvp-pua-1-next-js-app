import { analyticsEvents, type AnalyticsEventName } from "@/lib/analytics";
import { createAdminClient } from "@/lib/supabase/admin";

type AnalyticsRow = {
  event_name: AnalyticsEventName;
  event_props: Record<string, string | number | boolean | null>;
  path: string | null;
  created_at: string;
};

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function topEntries(map: Map<string, number>, limit = 10) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export async function getAnalyticsSummary() {
  const supabase = createAdminClient();
  if (!supabase) return { summary: null, error: "admin_not_configured" };

  const { data, error } = await supabase
    .from("analytics_events")
    .select("event_name,event_props,path,created_at")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) return { summary: null, error: error.message };

  const rows = (data ?? []) as AnalyticsRow[];
  const totals = Object.fromEntries(Object.values(analyticsEvents).map((eventName) => [eventName, 0])) as Record<
    AnalyticsEventName,
    number
  >;
  const categories = new Map<string, number>();
  const caseViews = new Map<string, number>();
  const scriptCopies = new Map<string, number>();
  const ctaLocations = new Map<string, number>();

  rows.forEach((row) => {
    totals[row.event_name] += 1;

    if (row.event_name === analyticsEvents.caseCategoryClick) {
      increment(categories, String(row.event_props.category ?? "未知分类"));
    }

    if (row.event_name === analyticsEvents.caseDetailView) {
      increment(caseViews, String(row.event_props.slug ?? row.path ?? "未知案例"));
    }

    if (row.event_name === analyticsEvents.caseScriptCopy) {
      increment(scriptCopies, String(row.event_props.slug ?? row.path ?? "未知案例"));
    }

    if (row.event_name === analyticsEvents.caseSubmitCtaClick) {
      increment(ctaLocations, String(row.event_props.location ?? "未知入口"));
    }
  });

  return {
    summary: {
      totals,
      categories: topEntries(categories),
      caseViews: topEntries(caseViews),
      scriptCopies: topEntries(scriptCopies),
      ctaLocations: topEntries(ctaLocations),
      recentEvents: rows.slice(0, 30),
    },
    error: null,
  };
}
