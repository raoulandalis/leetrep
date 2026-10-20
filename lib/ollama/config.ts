const DEFAULT_HOST = "http://127.0.0.1:11434";
const DEFAULT_MODEL = "llama3.2";

export type OllamaEnv = Record<string, string | undefined>;

export function isOllamaEnabled(env: OllamaEnv = process.env): boolean {
  return env.OLLAMA_ENABLED === "true" && !env.VERCEL;
}

export function ollamaHost(env: OllamaEnv = process.env): string {
  const host = env.OLLAMA_HOST?.trim().replace(/\/+$/, "");
  return host ? host : DEFAULT_HOST;
}

export function ollamaModel(env: OllamaEnv = process.env): string {
  const model = env.OLLAMA_MODEL?.trim();
  return model ? model : DEFAULT_MODEL;
}
