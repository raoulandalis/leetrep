"use client";

import type { ReactNode } from "react";
import { Onborda, OnbordaProvider } from "onborda";
import {
  TourCard,
  TourPersistBanner,
  TourPersistProvider,
} from "@/components/onborda/tour-card";
import { TourStarter } from "@/components/onborda/tour-starter";
import { tours } from "@/lib/onborda/tours";

export function OnbordaShell({
  children,
  shouldStartTour,
}: {
  children: ReactNode;
  shouldStartTour: boolean;
}) {
  return (
    <TourPersistProvider>
      <OnbordaProvider>
        <Onborda
          steps={tours}
          showOnborda={false}
          interact={false}
          cardComponent={TourCard}
          shadowRgb="15, 23, 32"
          shadowOpacity="0.72"
          cardTransition={{ type: "spring", duration: 0.45 }}
        >
          <TourStarter shouldStartTour={shouldStartTour} />
          {children}
        </Onborda>
      </OnbordaProvider>
      <TourPersistBanner />
    </TourPersistProvider>
  );
}
