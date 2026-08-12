"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/problems", label: "Problems" },
  { href: "/progress", label: "Progress" },
] as const;

const secondaryNav = [{ href: "/settings", label: "Settings" }] as const;

function NavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "font-display block px-3 py-2.5 text-sm font-bold tracking-[0.14em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane focus-visible:ring-offset-2 focus-visible:ring-offset-rail",
        active
          ? "bg-asphalt text-rail"
          : "text-asphalt/70 hover:bg-asphalt/5 hover:text-asphalt"
      )}
    >
      {label}
    </Link>
  );
}

export function AppNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-6" aria-label="App">
      <div className="flex flex-col gap-0.5">
        {primaryNav.map((item) => (
          <NavLink key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        {secondaryNav.map((item) => (
          <NavLink key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "font-display text-2xl font-extrabold tracking-tight",
        className
      )}
    >
      <span className="text-asphalt">Leet</span>
      <span className="italic text-lane">Rep</span>
    </Link>
  );
}
