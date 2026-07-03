create extension if not exists pgcrypto;

create type public.comment_kind as enum ('same_experience', 'advice', 'hug');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 80),
  content text not null check (char_length(content) >= 10),
  tags text[] not null default '{}',
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) >= 2),
  kind public.comment_kind not null default 'hug',
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  partner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  bound_at timestamptz,
  constraint couples_not_self check (partner_id is null or partner_id <> created_by)
);

create unique index couples_one_active_creator
  on public.couples(created_by)
  where partner_id is not null;

create unique index couples_one_active_partner
  on public.couples(partner_id)
  where partner_id is not null;

create table public.couple_diaries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) >= 2),
  mood text,
  created_at timestamptz not null default now()
);

create table public.case_submissions (
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

create index posts_created_at_idx on public.posts(created_at desc);
create index comments_post_id_created_at_idx on public.comments(post_id, created_at asc);
create index couples_invite_code_idx on public.couples(invite_code);
create index couple_diaries_couple_id_created_at_idx on public.couple_diaries(couple_id, created_at desc);
create index case_submissions_created_at_idx on public.case_submissions(created_at desc);
create index case_submissions_status_idx on public.case_submissions(status);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.couples enable row level security;
alter table public.couple_diaries enable row level security;
alter table public.case_submissions enable row level security;

create policy "Profiles are readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Posts are publicly readable"
  on public.posts for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can create posts"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Authors can update own posts"
  on public.posts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Comments are publicly readable"
  on public.comments for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can create comments"
  on public.comments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view relevant couples"
  on public.couples for select
  to authenticated
  using (
    auth.uid() = created_by
    or auth.uid() = partner_id
    or partner_id is null
  );

create policy "Users can create invite codes"
  on public.couples for insert
  to authenticated
  with check (auth.uid() = created_by and partner_id is null);

create policy "Users can bind open invite codes"
  on public.couples for update
  to authenticated
  using (partner_id is null and auth.uid() <> created_by)
  with check (partner_id = auth.uid() and auth.uid() <> created_by);

create policy "Couple diaries are readable by bound partners"
  on public.couple_diaries for select
  to authenticated
  using (
    exists (
      select 1
      from public.couples c
      where c.id = couple_diaries.couple_id
        and (c.created_by = auth.uid() or c.partner_id = auth.uid())
        and c.partner_id is not null
    )
  );

create policy "Bound partners can create couple diaries"
  on public.couple_diaries for insert
  to authenticated
  with check (
    auth.uid() = author_id
    and exists (
      select 1
      from public.couples c
      where c.id = couple_diaries.couple_id
        and (c.created_by = auth.uid() or c.partner_id = auth.uid())
        and c.partner_id is not null
    )
  );

create policy "Anyone can submit anonymous cases"
  on public.case_submissions for insert
  to anon, authenticated
  with check (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nickname', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
