"use client";

import { useSyncExternalStore, type ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function ClientChart({
  className,
  height,
  children,
}: {
  className?: string;
  height?: number;
  children: ReactElement;
}) {
  const isClient = useIsClient();

  return (
    <div className={className} style={height ? { height } : undefined}>
      {isClient ? (
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
