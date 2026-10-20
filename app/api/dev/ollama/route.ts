import { isOllamaEnabled } from "@/lib/ollama/config";

export async function GET() {
  if (!isOllamaEnabled()) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const { checkOllamaConnection } = await import("@/lib/ollama/status");
  return Response.json(await checkOllamaConnection());
}

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

  const message =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
      ? body.message.trim()
      : "";

  if (!message) {
    return Response.json({ error: "Missing message." }, { status: 400 });
  }

  const { askOllama, OllamaUnavailableError } = await import(
    "@/lib/ollama/client"
  );

  try {
    const reply = await askOllama(message);
    return Response.json({ message: reply });
  } catch (error) {
    if (error instanceof OllamaUnavailableError) {
      return Response.json({ error: "Ollama is unavailable." }, { status: 503 });
    }

    throw error;
  }
}
