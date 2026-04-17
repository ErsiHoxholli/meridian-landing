"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "./wordmark";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#product", label: "Product" },
  { href: "#pricing", label: "Pricing" },
  { href: "#security", label: "Security" },
  { href: "#docs", label: "Docs" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors",
        scrolled && "border-b border-border bg-bg/80 backdrop-blur-md"
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-10"
        aria-label="Primary"
      >
        <Link href="/" aria-label="Meridian home" className="inline-flex items-center">
          <Wordmark />
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-fg-muted hover:text-fg transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link
            href="#signin"
            className="hidden text-sm text-fg-muted hover:text-fg md:inline-block"
          >
            Sign In
          </Link>
          <Button asChild size="sm">
            <Link href="#waitlist">Get Early Access</Link>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
