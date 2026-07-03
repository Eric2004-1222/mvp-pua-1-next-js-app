create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (
    event_name in (
      'cases_page_view',
      'case_category_click',
      'case_detail_view',
      'case_script_copy',
      'case_submit_cta_click',
      'case_submission_success'
    )
  ),
  event_props jsonb not null default '{}'::jsonb,
  path text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_event_name_created_at_idx
  on public.analytics_events(event_name, created_at desc);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events(created_at desc);

create index if not exists analytics_events_event_props_idx
  on public.analytics_events using gin(event_props);

alter table public.analytics_events enable row level security;

drop policy if exists "Anyone can insert analytics events" on public.analytics_events;

create policy "Anyone can insert analytics events"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);
