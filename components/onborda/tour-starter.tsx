"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useOnborda } from "onborda";
import { shouldStartTour } from "@/lib/onborda/should-start-tour";

export function TourStarter({
  shouldStartTour: profileAllowsTour,
}: {
  shouldStartTour: boolean;
}) {
  const pathname = usePathname();
  const { startOnborda } = useOnborda();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    if (!shouldStartTour(profileAllowsTour ? null : "completed", pathname)) {
      return;
    }
    started.current = true;
    startOnborda("welcome");
  }, [pathname, profileAllowsTour, startOnborda]);

  return null;
}
