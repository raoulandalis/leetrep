"use client";

import { useCallback, useEffect, useState } from "react";
import type { OllamaConnection } from "@/lib/ollama/status";

type StatusState =
  | { kind: "loading" }
  | { kind: "hidden" }
  | { kind: "ready"; connection: OllamaConnection };

export function OllamaStatus() {
  const [state, setState] = useState<StatusState>({ kind: "loading" });

  const check = useCallback(async () => {
    setState({ kind: "loading" });

    const response = await fetch("/api/dev/ollama");
    if (response.status === 404) {
      setState({ kind: "hidden" });
      return;
    }

    const connection = (await response.json()) as OllamaConnection;
    setState({ kind: "ready", connection });
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  if (state.kind === "hidden") {
    return null;
  }

  const summary =
    state.kind === "loading"
      ? "Checking Ollama..."
      : statusSummary(state.connection);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-asphalt/80" role="status">
        {summary}
      </p>
      <button
        type="button"
        onClick={() => void check()}
        disabled={state.kind === "loading"}
        className="h-11 w-fit rounded-none border border-asphalt/20 bg-transparent px-5 font-display text-sm font-extrabold tracking-[0.12em] text-asphalt uppercase transition-colors hover:bg-asphalt/5 disabled:opacity-50"
      >
        Check again
      </button>
    </div>
  );
}

function statusSummary(connection: OllamaConnection): string {
  if (!connection.connected) {
    return "Not connected. Ollama is not running on this machine.";
  }

  if (!connection.modelReady) {
    return `Ollama is running, but ${connection.model} is not pulled.`;
  }

  return `Connected. ${connection.model} is ready.`;
}
