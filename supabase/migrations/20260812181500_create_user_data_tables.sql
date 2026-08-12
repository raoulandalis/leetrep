-- PRD 3: profiles, problems, journals, review_tasks + RLS
-- Apply: npx supabase db push (after supabase link)

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.problems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  leetcode_url text not null,
  title text not null,
  difficulty text not null,
  patterns text[] not null default '{}',
  date_completed date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint problems_difficulty_check check (difficulty in ('Easy', 'Medium', 'Hard'))
);

create table public.journals (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  approach text,
  key_insight text,
  why_it_works text,
  time_complexity text,
  space_complexity text,
  struggles text,
  additional_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.review_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  problem_id uuid not null references public.problems (id) on delete cascade,
  review_type text not null,
  scheduled_for date not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint review_tasks_review_type_check check (review_type in ('Recall', 'Re-solve'))
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index profiles_user_id_idx on public.profiles (user_id);
create index problems_user_id_idx on public.problems (user_id);
create index journals_user_id_idx on public.journals (user_id);
create index journals_problem_id_idx on public.journals (problem_id);
create index review_tasks_user_id_idx on public.review_tasks (user_id);
create index review_tasks_problem_id_idx on public.review_tasks (problem_id);
create index review_tasks_user_id_scheduled_for_idx on public.review_tasks (user_id, scheduled_for);

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup + backfill existing users
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    split_part(new.email, '@', 1)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

insert into public.profiles (user_id, display_name)
select
  u.id,
  split_part(u.email, '@', 1)
from auth.users u
where not exists (
  select 1 from public.profiles p where p.user_id = u.id
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.problems enable row level security;
alter table public.journals enable row level security;
alter table public.review_tasks enable row level security;

-- profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (user_id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (user_id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "profiles_delete_own"
  on public.profiles for delete
  using (user_id = auth.uid());

-- problems
create policy "problems_select_own"
  on public.problems for select
  using (user_id = auth.uid());

create policy "problems_insert_own"
  on public.problems for insert
  with check (user_id = auth.uid());

create policy "problems_update_own"
  on public.problems for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "problems_delete_own"
  on public.problems for delete
  using (user_id = auth.uid());

-- journals
create policy "journals_select_own"
  on public.journals for select
  using (user_id = auth.uid());

create policy "journals_insert_own"
  on public.journals for insert
  with check (user_id = auth.uid());

create policy "journals_update_own"
  on public.journals for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "journals_delete_own"
  on public.journals for delete
  using (user_id = auth.uid());

-- review_tasks
create policy "review_tasks_select_own"
  on public.review_tasks for select
  using (user_id = auth.uid());

create policy "review_tasks_insert_own"
  on public.review_tasks for insert
  with check (user_id = auth.uid());

create policy "review_tasks_update_own"
  on public.review_tasks for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "review_tasks_delete_own"
  on public.review_tasks for delete
  using (user_id = auth.uid());
