import { cn } from "@/lib/cn";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      translate="no"
      className={cn("font-serif text-xl tracking-tight text-fg select-none", className)}
      aria-label="Meridian"
    >
      Meridian<span className="text-accent-text">.</span>
    </span>
  );
}
