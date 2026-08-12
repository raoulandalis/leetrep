-- Table-level GRANTs are required in addition to RLS.
-- Without these, authenticated users get 42501 permission denied on insert.

grant usage on schema public to authenticated;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.problems to authenticated;
grant select, insert, update, delete on table public.journals to authenticated;
grant select, insert, update, delete on table public.review_tasks to authenticated;
