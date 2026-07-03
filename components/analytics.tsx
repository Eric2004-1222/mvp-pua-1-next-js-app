"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { AnalyticsEventName, AnalyticsProperties } from "@/lib/analytics";

export function trackEvent(eventName: AnalyticsEventName, properties: AnalyticsProperties = {}) {
  const payload = JSON.stringify({
    eventName,
    properties,
    path: window.location.pathname + window.location.search,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
    return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

export function AnalyticsEvent({
  eventName,
  properties,
}: {
  eventName: AnalyticsEventName;
  properties?: AnalyticsProperties;
}) {
  useEffect(() => {
    trackEvent(eventName, properties);
  }, [eventName, properties]);

  return null;
}

export function TrackedLink({
  href,
  eventName,
  properties,
  className,
  children,
}: {
  href: string;
  eventName: AnalyticsEventName;
  properties?: AnalyticsProperties;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackEvent(eventName, properties)}>
      {children}
    </Link>
  );
}
