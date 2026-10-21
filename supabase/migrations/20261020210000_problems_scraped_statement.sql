-- Local-only LeetCode statement cache. Existing selects do not read this column.

alter table public.problems
  add column scraped_statement text;
