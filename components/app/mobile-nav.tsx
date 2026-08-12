"use client";

import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { AppNav, Wordmark } from "@/components/app/app-nav";
import { UserMenu } from "@/components/app/user-menu";
import { Button } from "@/components/ui/button";

type MobileNavProps = {
  email: string | undefined;
  displayName: string;
};

export function MobileNav({ email, displayName }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-steel-seam bg-rail px-4 text-asphalt lg:hidden">
        <Wordmark className="text-xl" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-none text-asphalt hover:bg-asphalt/5"
          aria-expanded={open}
          aria-controls="app-mobile-drawer"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" id="app-mobile-drawer">
          <button
            type="button"
            className="absolute inset-0 bg-asphalt/55 transition-opacity duration-200"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] animate-[landing-rise_200ms_ease-out] flex-col border-r border-asphalt/10 bg-rail text-asphalt shadow-none"
          >
            <div className="flex h-14 items-center justify-between border-b border-asphalt/10 px-4">
              <Wordmark className="text-xl" />
              <p id={titleId} className="sr-only">
                Navigation
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-none text-asphalt hover:bg-asphalt/5"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
                <span className="sr-only">Close navigation</span>
              </Button>
            </div>
            <div className="flex flex-1 flex-col px-4 py-5">
              <AppNav onNavigate={() => setOpen(false)} />
              <UserMenu email={email} displayName={displayName} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
