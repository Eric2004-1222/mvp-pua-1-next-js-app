create table if not exists public.case_submissions (
  id uuid primary key default gen_random_uuid(),
  relationship_status text not null check (relationship_status in ('恋爱中', '异地', '暧昧', '分手后', '复合中')),
  category text not null check (category in ('冷战', '异地恋', '边界感', '吵架沟通', '分手复合', '暧昧关系')),
  background text not null check (char_length(background) >= 10),
  grievance text not null check (char_length(grievance) >= 6),
  partner_behavior text not null check (char_length(partner_behavior) >= 6),
  desired_outcome text not null check (desired_outcome in ('和好', '判断谁错', '设边界', '分手', '不确定')),
  allow_anonymous_display boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'published', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists case_submissions_created_at_idx
  on public.case_submissions(created_at desc);

create index if not exists case_submissions_status_idx
  on public.case_submissions(status);

alter table public.case_submissions enable row level security;

drop policy if exists "Anyone can submit anonymous cases" on public.case_submissions;

create policy "Anyone can submit anonymous cases"
  on public.case_submissions for insert
  to anon, authenticated
  with check (true);
