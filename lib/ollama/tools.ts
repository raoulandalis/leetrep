import { getJournal } from "@/lib/journals/queries";
import { getProblem } from "@/lib/problems/queries";
import { todayYmd } from "@/lib/reviews/schedule";
import { listReviewTasksForProblem } from "@/lib/reviews/queries";
import { createClient } from "@/lib/supabase/server";
import type { OllamaTool } from "./client";
import { shapeProblemRecord } from "./record";
import {
  fetchProblemStatement,
  problemSlug,
  resolveStatement,
  scrapedProblemResult,
} from "./statement";

export const LOAD_PROBLEMS = "load_problems";
export const LOAD_SCRAPED_PROBLEM = "load_scraped_problem";

export const scrapedProblemTools: OllamaTool[] = [
  {
    type: "function",
    function: {
      name: LOAD_SCRAPED_PROBLEM,
      description:
        "Return this problem's statement, examples, and constraints. Use it when the user asks what the problem says, asks for it explained another way, or asks how to solve it. This returns the question only.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
];

export const problemTools: OllamaTool[] = [
  {
    type: "function",
    function: {
      name: LOAD_PROBLEMS,
      description:
        "Return what this user saved for the current problem: title, difficulty, patterns, confidence, review status, and their journal. Use it when they ask about their own notes, approach, or solution. This is what they wrote, not the correct answer.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  scrapedProblemTools[0],
];

export async function loadProblems(problemId: string): Promise<string> {
  const { problem, error } = await getProblem(problemId);
  if (error || !problem) {
    return JSON.stringify({ error: error ?? "Not found." });
  }

  const journalResult = await getJournal(problemId);
  if (journalResult.error) {
    return JSON.stringify({ error: journalResult.error });
  }

  const tasksResult = await listReviewTasksForProblem(problemId);
  if (tasksResult.error) {
    return JSON.stringify({ error: tasksResult.error });
  }

  return JSON.stringify(
    shapeProblemRecord({
      problem,
      journal: journalResult.journal,
      tasks: tasksResult.tasks,
      today: todayYmd(),
    })
  );
}

export async function loadScrapedProblem(problemId: string): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return scrapedProblemResult(null);
  }

  const { data, error } = await supabase
    .from("problems")
    .select("leetcode_url, scraped_statement")
    .eq("id", problemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data || typeof data.leetcode_url !== "string") {
    return scrapedProblemResult(null);
  }

  const cached =
    typeof data.scraped_statement === "string" ? data.scraped_statement : null;
  const fetched = cached?.trim()
    ? null
    : await fetchStatement(data.leetcode_url);
  const resolved = resolveStatement(cached, fetched);

  if (!resolved.statement) {
    return scrapedProblemResult(null);
  }

  if (resolved.source === "fetch") {
    await supabase
      .from("problems")
      .update({ scraped_statement: resolved.statement })
      .eq("id", problemId)
      .eq("user_id", user.id);
  }

  return scrapedProblemResult(resolved.statement);
}

async function fetchStatement(url: string): Promise<string | null> {
  const slug = problemSlug(url);
  if (!slug) {
    return null;
  }

  return fetchProblemStatement(slug);
}

export async function runProblemTool(
  name: string,
  problemId: string
): Promise<string> {
  if (name === LOAD_PROBLEMS) {
    return loadProblems(problemId);
  }

  if (name === LOAD_SCRAPED_PROBLEM) {
    return loadScrapedProblem(problemId);
  }

  return JSON.stringify({ error: "Unknown tool." });
}
