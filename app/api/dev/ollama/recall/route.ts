import { isOllamaEnabled } from "@/lib/ollama/config";
import { getJournal } from "@/lib/journals/queries";
import { getProblem } from "@/lib/problems/queries";
import { recallPromptSteps } from "@/lib/reviews/recall";

const SIGN_IN_ERROR = "You need to sign in to view this problem.";

export async function POST(request: Request) {
  if (!isOllamaEnabled()) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const message = readString(body, "message");
  if (!message) {
    return Response.json({ error: "Missing message." }, { status: 400 });
  }

  const problemId = readString(body, "problemId");
  if (!problemId) {
    return Response.json({ error: "Missing problem id." }, { status: 400 });
  }

  const { problem, error } = await getProblem(problemId);
  if (error === SIGN_IN_ERROR) {
    return Response.json({ error }, { status: 401 });
  }
  if (error) {
    return Response.json({ error }, { status: 400 });
  }
  if (!problem) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const journalResult = await getJournal(problemId);
  if (journalResult.error) {
    return Response.json({ error: journalResult.error }, { status: 400 });
  }
  if (!journalResult.journal) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const steps = recallPromptSteps(journalResult.journal);
  const requestedIndex = readIndex(body);
  if (requestedIndex >= steps.length) {
    return Response.json({
      message: "",
      advance: false,
      stepIndex: steps.length,
      done: true,
    });
  }

  const step = steps[requestedIndex];
  const {
    askOllama,
    OllamaUnavailableError,
  } = await import("@/lib/ollama/client");
  const { nextRecallStep, parseRecallTurn, recallInstruction, lookupInstruction, toolNameFromText } =
    await import("@/lib/ollama/recall-turn");
  const { LOAD_SCRAPED_PROBLEM, runProblemTool, scrapedProblemTools } =
    await import("@/lib/ollama/tools");

  try {
    let lookedUp = "";
    const runTool = async (name: string) => {
      if (name !== LOAD_SCRAPED_PROBLEM) {
        return JSON.stringify({ error: "That tool is not available." });
      }
      const result = await runProblemTool(name, problemId);
      lookedUp = result;
      return result;
    };
    const history = readHistory(body);

    try {
      await askOllama(message, {
        system: lookupInstruction(),
        history,
        tools: scrapedProblemTools,
        runTool,
      });
    } catch (caught) {
      if (!(caught instanceof OllamaUnavailableError) || !lookedUp) {
        throw caught;
      }
    }

    const replySystem = (problemText: string) =>
      [recallInstruction(step.prompt), problemText ? `Problem text:\n${problemText}` : ""]
        .filter(Boolean)
        .join("\n\n");

    let raw = await askOllama(message, {
      system: replySystem(lookedUp),
      history,
      format: "json",
    });

    if (toolNameFromText(raw) || toolNameFromText(parseRecallTurn(raw).message)) {
      if (!lookedUp) {
        lookedUp = await runProblemTool(LOAD_SCRAPED_PROBLEM, problemId);
      }
      raw = await askOllama(message, {
        system: replySystem(lookedUp),
        history,
        format: "json",
      });
    }

    const parsed = parseRecallTurn(raw);
    const turn =
      toolNameFromText(raw) || toolNameFromText(parsed.message)
        ? { advance: false, message: step.prompt }
        : parsed;
    const stepIndex = nextRecallStep(requestedIndex, steps.length, turn.advance);

    return Response.json({
      message: turn.message,
      advance: turn.advance,
      stepIndex,
      done: stepIndex >= steps.length,
    });
  } catch (caught) {
    if (caught instanceof OllamaUnavailableError) {
      return Response.json({ error: "Ollama is unavailable." }, { status: 503 });
    }

    throw caught;
  }
}

function readString(body: unknown, key: string): string {
  if (typeof body !== "object" || body === null || !(key in body)) {
    return "";
  }

  const record = body as Record<string, unknown>;
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}

function readIndex(body: unknown): number {
  if (typeof body !== "object" || body === null || !("stepIndex" in body)) {
    return 0;
  }

  const value = body.stepIndex;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

function readHistory(
  body: unknown
): { role: "user" | "assistant"; content: string }[] {
  if (typeof body !== "object" || body === null || !("history" in body)) {
    return [];
  }

  if (!Array.isArray(body.history)) {
    return [];
  }

  return body.history.flatMap((turn) => {
    if (typeof turn !== "object" || turn === null) {
      return [];
    }

    const role = "role" in turn ? turn.role : undefined;
    const content = "content" in turn ? turn.content : undefined;
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string" ||
      content.trim() === ""
    ) {
      return [];
    }

    return [{ role, content: content.trim() }];
  });
}
