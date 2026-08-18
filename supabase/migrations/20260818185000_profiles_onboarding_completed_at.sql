-- First-run product tour: null means "not completed"; timestamp means done.
-- Existing users are marked complete so they are not shown the new tour.

alter table public.profiles
  add column onboarding_completed_at timestamptz;

update public.profiles
  set onboarding_completed_at = now()
  where onboarding_completed_at is null;
