import { isOllamaEnabled } from "@/lib/ollama/config";

const SIGN_IN_ERROR = "You need to sign in to view this problem.";

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

  const message = readString(body, "message");
  if (!message) {
    return Response.json({ error: "Missing message." }, { status: 400 });
  }

  const problemId = readString(body, "problemId");
  const { askOllama, OllamaUnavailableError } = await import(
    "@/lib/ollama/client"
  );

  try {
    if (!problemId) {
      const reply = await askOllama(message);
      return Response.json({ message: reply });
    }

    const { getProblem } = await import("@/lib/problems/queries");
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

    const { problemTools, runProblemTool } = await import("@/lib/ollama/tools");
    const reply = await askOllama(message, {
      tools: problemTools,
      runTool: (name) => runProblemTool(name, problemId),
    });
    return Response.json({ message: reply });
  } catch (error) {
    if (error instanceof OllamaUnavailableError) {
      return Response.json({ error: "Ollama is unavailable." }, { status: 503 });
    }

    throw error;
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
