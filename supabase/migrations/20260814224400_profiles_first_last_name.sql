-- Replace profiles.display_name with first_name + last_name.
-- Names stay nullable; Settings will fill them later. New signups get an empty profile.

alter table public.profiles
  add column first_name text,
  add column last_name text;

alter table public.profiles
  drop column display_name;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id)
  values (new.id);
  return new;
end;
$$;
