-- PRD 6: one journal per problem
drop index if exists public.journals_problem_id_idx;

alter table public.journals
  add constraint journals_problem_id_key unique (problem_id);
