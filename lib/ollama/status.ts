import { ollamaHost, ollamaModel } from "./config.ts";

export type OllamaConnection = {
  connected: boolean;
  model: string;
  modelReady: boolean;
};

export function modelIsReady(models: readonly string[], model: string): boolean {
  return models.some((name) => name === model || name.startsWith(`${model}:`));
}

export function readModelNames(body: unknown): string[] {
  if (typeof body !== "object" || body === null || !("models" in body)) {
    return [];
  }

  const models = body.models;
  if (!Array.isArray(models)) {
    return [];
  }

  return models.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null || !("name" in entry)) {
      return [];
    }

    return typeof entry.name === "string" ? [entry.name] : [];
  });
}

export async function checkOllamaConnection(): Promise<OllamaConnection> {
  const model = ollamaModel();

  try {
    const response = await fetch(`${ollamaHost()}/api/tags`);
    if (!response.ok) {
      return { connected: false, model, modelReady: false };
    }

    const names = readModelNames(await response.json());
    return {
      connected: true,
      model,
      modelReady: modelIsReady(names, model),
    };
  } catch {
    return { connected: false, model, modelReady: false };
  }
}
