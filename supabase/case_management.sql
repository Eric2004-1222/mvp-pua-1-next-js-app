create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) between 2 and 120),
  category text not null check (category in ('冷战', '异地恋', '边界感', '吵架沟通', '分手/复合', '暧昧关系')),
  source_type text not null default 'editor_case' check (source_type in ('anonymous_submission', 'editor_case')),
  risk_level text not null default '中风险' check (risk_level in ('低风险', '中风险', '高风险')),
  summary text not null check (char_length(summary) >= 6),
  views integer not null default 0 check (views >= 0),
  comments integer not null default 0 check (comments >= 0),
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  situation text not null default '',
  behavior_one text not null default '',
  behavior_two text not null default '',
  conflict text not null default '',
  analysis text not null default '',
  scripts text[] not null default '{}',
  discussion text[] not null default '{}',
  source_submission_id uuid references public.case_submissions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cases_status_created_at_idx
  on public.cases(status, created_at desc);

create index if not exists cases_category_status_idx
  on public.cases(category, status);

create index if not exists cases_featured_idx
  on public.cases(featured)
  where featured = true;

alter table public.cases enable row level security;

drop policy if exists "Published cases are publicly readable" on public.cases;

create policy "Published cases are publicly readable"
  on public.cases for select
  to anon, authenticated
  using (status = 'published');
