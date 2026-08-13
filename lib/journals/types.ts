export type Journal = {
  id: string;
  problem_id: string;
  user_id: string;
  approach: string | null;
  key_insight: string | null;
  why_it_works: string | null;
  time_complexity: string | null;
  space_complexity: string | null;
  struggles: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type JournalInput = {
  approach: string | null;
  key_insight: string | null;
  why_it_works: string | null;
  time_complexity: string | null;
  space_complexity: string | null;
  struggles: string | null;
  additional_notes: string | null;
};
