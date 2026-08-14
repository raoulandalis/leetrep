import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ADD_PROBLEM_CLASS =
  "inline-flex h-12 items-center justify-center bg-lane px-6 font-display text-base font-extrabold tracking-[0.12em] text-asphalt uppercase shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[transform,box-shadow,background-color] hover:bg-lane/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt";

export function AddProblemLink({
  className,
  children = "+ Add Problem",
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Link href="/problems/new" className={cn(ADD_PROBLEM_CLASS, className)}>
      {children}
    </Link>
  );
}
