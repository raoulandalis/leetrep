import { ollamaHost, ollamaModel } from "./config.ts";
import { toolNameFromText } from "./recall-turn.ts";

export class OllamaUnavailableError extends Error {
  constructor(message = "Ollama is unavailable.") {
    super(message);
    this.name = "OllamaUnavailableError";
  }
}

export type OllamaTool = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, never>;
      required: string[];
    };
  };
};

type ToolCall = {
  function: {
    name: string;
  };
};

type ChatMessage = {
  role: string;
  content: string;
  tool_calls?: unknown;
  tool_name?: string;
};

type ChatResponse = {
  message?: {
    role?: string;
    content?: unknown;
    tool_calls?: unknown;
  };
};

const MAX_ROUNDS = 3;

export type OllamaHistoryTurn = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function askOllama(
  message: string,
  options?: {
    tools?: OllamaTool[];
    runTool?: (name: string) => Promise<string>;
    system?: string;
    history?: OllamaHistoryTurn[];
    format?: "json";
  }
): Promise<string> {
  const messages: ChatMessage[] = [];
  const system = options?.system?.trim();
  if (system) {
    messages.push({ role: "system", content: system });
  }

  for (const turn of options?.history ?? []) {
    const content = turn.content.trim();
    if (!content) {
      continue;
    }
    if (
      turn.role !== "system" &&
      turn.role !== "user" &&
      turn.role !== "assistant"
    ) {
      continue;
    }
    messages.push({ role: turn.role, content });
  }

  messages.push({ role: "user", content: message });
  let lastContent = "";

  for (let round = 0; round < MAX_ROUNDS; round += 1) {
    const data = await postChat(messages, options?.tools, options?.format);
    const content =
      typeof data.message?.content === "string" ? data.message.content : "";
    lastContent = content;
    const toolCalls = toolCallsFrom(data.message);
    const writtenTool =
      toolCalls.length === 0 ? toolNameFromText(content) : null;

    if (options?.runTool && writtenTool) {
      let result: string;
      try {
        result = await options.runTool(writtenTool);
      } catch {
        result = JSON.stringify({ error: "The tool failed." });
      }

      if (round === MAX_ROUNDS - 1) {
        lastContent = "";
        break;
      }

      messages.push({ role: "assistant", content: "" });
      messages.push({
        role: "tool",
        content: result,
        tool_name: writtenTool,
      });
      continue;
    }

    if (!options?.runTool || toolCalls.length === 0) {
      if (content.trim() === "") {
        throw new OllamaUnavailableError();
      }
      return content;
    }

    if (round === MAX_ROUNDS - 1) {
      break;
    }

    messages.push({
      role: "assistant",
      content,
      tool_calls: data.message?.tool_calls,
    });

    for (const call of toolCalls) {
      let result: string;
      try {
        result = await options.runTool(call.function.name);
      } catch {
        result = JSON.stringify({ error: "The tool failed." });
      }

      messages.push({
        role: "tool",
        content: result,
        tool_name: call.function.name,
      });
    }
  }

  if (lastContent.trim() !== "") {
    return lastContent;
  }

  return "The model did not return an answer.";
}

function toolCallsFrom(message: ChatResponse["message"]): ToolCall[] {
  if (!message || !Array.isArray(message.tool_calls)) {
    return [];
  }

  return message.tool_calls.flatMap((call) => {
    if (typeof call !== "object" || call === null || !("function" in call)) {
      return [];
    }

    const fn = call.function;
    if (
      typeof fn !== "object" ||
      fn === null ||
      !("name" in fn) ||
      typeof fn.name !== "string" ||
      fn.name.trim() === ""
    ) {
      return [];
    }

    return [{ function: { name: fn.name } }];
  });
}

async function postChat(
  messages: ChatMessage[],
  tools: OllamaTool[] | undefined,
  format?: "json"
): Promise<ChatResponse> {
  let response: Response;

  try {
    response = await fetch(`${ollamaHost()}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel(),
        messages,
        stream: false,
        ...(format ? { format } : {}),
        ...(tools && tools.length > 0 ? { tools } : {}),
      }),
    });
  } catch {
    throw new OllamaUnavailableError();
  }

  if (!response.ok) {
    throw new OllamaUnavailableError();
  }

  try {
    return (await response.json()) as ChatResponse;
  } catch {
    throw new OllamaUnavailableError();
  }
}
