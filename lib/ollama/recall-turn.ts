export type RecallTurn = {
  advance: boolean;
  message: string;
};

export function lookupInstruction(): string {
  return [
    "Call the load_scraped_problem tool to read the problem statement, examples, and constraints.",
    "Do not answer the user.",
  ].join("\n");
}

export function recallInstruction(prompt: string): string {
  return [
    "You are a helpful teacher coaching one recall prompt at a time.",
    "The message must sound like something a helpful teacher would say out loud: warm, clear, and encouraging.",
    "Explain simply, and stay patient when the attempt is incomplete.",
    `The current prompt is: ${prompt}`,
    "The problem text is already included when it was found. Do not write a tool call.",
    "You do not have the user's saved notes. Do not invent them.",
    "Decide from the user's latest message only.",
    "Reply with one JSON object and no other text. Every reply uses one of these two shapes:",
    '{"advance":true,"message":"..."}',
    '{"advance":false,"message":"..."}',
    "Set advance to true when the latest message states their own steps, idea, reason, or complexity. A short or incomplete walkthrough still counts. Also set advance to true when they give up, ask for the answer, or ask what is next.",
    "Set advance to false only when they ask what the problem is, for an example, a definition, or a hint.",
    "When advance is true and they stated their own attempt, write two sentences about their words. Do not add steps they did not say.",
    "When advance is true because they gave up or asked for the answer, explain the solution in at most four sentences.",
    "When advance is false, write two sentences, then repeat the current prompt. Leave out the algorithm.",
    "Do not copy a sample solution into the message.",
  ].join("\n");
}

const TOOL_NAMES = ["load_scraped_problem", "load_problems"] as const;

export function toolNameFromText(raw: string): string | null {
  const flat = raw.replace(/\\"/g, '"');

  for (const name of TOOL_NAMES) {
    if (!new RegExp(`"(?:name|function)"\\s*:\\s*"${name}"`).test(flat)) {
      continue;
    }

    const message = flat.match(/"message"\s*:\s*"([^"]*)"/);
    if (message && !flat.slice(flat.indexOf('"message"')).includes(`"${name}"`)) {
      return null;
    }

    return name;
  }

  return null;
}

export function parseRecallTurn(raw: string): RecallTurn {
  const trimmed = raw.trim();
  const candidate = jsonCandidate(trimmed);

  if (candidate) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      if (isTurn(parsed)) {
        return {
          advance: parsed.advance === true,
          message: parsed.message.trim(),
        };
      }
    } catch {
      // Fall through to the raw text.
    }
  }

  return {
    advance: false,
    message: trimmed || "Try that answer again.",
  };
}

export function nextRecallStep(
  stepIndex: number,
  stepCount: number,
  advance: boolean
): number {
  const current = Math.max(0, Math.min(stepIndex, stepCount));
  if (!advance || current >= stepCount) {
    return current;
  }

  return current + 1;
}

function jsonCandidate(raw: string): string | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced?.[1]?.trim() || raw;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start < 0 || end <= start) {
    return null;
  }

  return source.slice(start, end + 1);
}

function isTurn(value: unknown): value is { advance?: unknown; message: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string" &&
    value.message.trim().length > 0
  );
}
