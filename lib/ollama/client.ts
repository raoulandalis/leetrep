import { ollamaHost, ollamaModel } from "./config";

export class OllamaUnavailableError extends Error {
  constructor(message = "Ollama is unavailable.") {
    super(message);
    this.name = "OllamaUnavailableError";
  }
}

type ChatResponse = {
  message?: {
    content?: unknown;
  };
};

export async function askOllama(message: string): Promise<string> {
  let response: Response;

  try {
    response = await fetch(`${ollamaHost()}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel(),
        messages: [{ role: "user", content: message }],
        stream: false,
      }),
    });
  } catch {
    throw new OllamaUnavailableError();
  }

  if (!response.ok) {
    throw new OllamaUnavailableError();
  }

  let data: ChatResponse;
  try {
    data = (await response.json()) as ChatResponse;
  } catch {
    throw new OllamaUnavailableError();
  }

  const content = data.message?.content;
  if (typeof content !== "string" || content.trim() === "") {
    throw new OllamaUnavailableError();
  }

  return content;
}
