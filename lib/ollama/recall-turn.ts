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
    "An answer states their own steps, idea, reason, or complexity for the current prompt. Commands, fragments, and a walkthrough with no question mark count. An incomplete answer still counts. Set advance to true. Acknowledge what they said in 2-3 sentences. Do not ask the current prompt again.",
    "A question asks you for the problem, an example, a definition, a hint, or the solution. Set advance to false. Answer in 2-3 sentences, then ask the current prompt again.",
    "If they asked what the problem is, restate only the question, the inputs, and an example. Do not include an algorithm, complexity, or code.",
    "Reveal a solution only when they explicitly ask how to solve it or ask for the solution. That reply may be longer.",
    "Write a new message about their words. Do not reuse an example.",
    "Example of an answer:",
    "User: Use two pointers from the outside and move the smaller side inward.",
    '{"advance":true,"message":"You have the idea. Start at both ends and move the pointer on the smaller side."}',
    "Example of a question:",
    "User: What does this function return?",
    '{"advance":false,"message":"It returns the pair of lines that hold the most water. When you are ready, tell me the idea that made it click."}',
    'Reply with JSON only: {"advance":true or false,"message":"..."}',
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
