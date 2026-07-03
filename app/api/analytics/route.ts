import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyticsEvents, type AnalyticsEventName } from "@/lib/analytics";

const validEvents = new Set<string>(Object.values(analyticsEvents));

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const body = payload as {
    eventName?: string;
    properties?: Record<string, unknown>;
    path?: string;
  };

  if (!body.eventName || !validEvents.has(body.eventName)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("analytics_events").insert({
    event_name: body.eventName as AnalyticsEventName,
    event_props: body.properties ?? {},
    path: body.path ?? null,
  });

  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
