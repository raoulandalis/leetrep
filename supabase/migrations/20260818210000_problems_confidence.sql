-- Self-rated confidence gates whether a problem enters the review queue.

alter table public.problems
  add column confidence text;

alter table public.problems
  add constraint problems_confidence_check
  check (
    confidence is null
    or confidence in ('Needs work', 'Keep practicing', 'Confident')
  );
