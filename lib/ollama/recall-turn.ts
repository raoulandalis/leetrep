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
    "Keep every reply to 2-3 sentences, then ask the current prompt again, unless the user explicitly asks for the solution.",
    "If they ask what the problem is, restate only the question, the inputs, and an example. Do not include an algorithm, complexity, or code.",
    "Reveal a solution only when they explicitly ask how to solve it or ask for the solution. That reply may be longer.",
    "If the user answered the current prompt, set advance to true. Acknowledge the answer in 2-3 sentences. Do not ask the next prompt.",
    'Example: {"advance":true,"message":"Nice work. You walked through the approach clearly."}',
    "If the user asked a side question, or the attempt is too thin, set advance to false.",
    'Example: {"advance":false,"message":"Good question. You get an array of numbers and a target, and you need two indexes that add up to it. When you are ready, walk through how you would solve this."}',
    "You do not have the user's saved notes. Do not invent them.",
    'Reply with JSON only: {"advance":false,"message":"..."}',
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
