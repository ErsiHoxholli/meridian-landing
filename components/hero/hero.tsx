import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreviewCard } from "./preview-card";

export function Hero() {
  return (
    <section id="main" className="relative mx-auto max-w-[1280px] px-6 pb-24 pt-16 md:px-10 md:pt-24 lg:pb-32 lg:pt-28">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">Unified Finance OS</p>
          <h1 className="mt-5 font-serif text-[clamp(2.75rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-balance">
            One account for{" "}
            <em className="italic text-accent-text">every</em> kind of money.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg text-fg-muted md:text-xl">
            Treasury, brokerage, and crypto in a single ledger. Built for founders, operators, and anyone whose money doesn&apos;t fit in one box.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="#waitlist">Get Early Access</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="#demo">
                See live demo <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-fg-subtle">
            SOC&nbsp;2 Type&nbsp;II · FDIC partner banks · 0% custody risk
          </p>
        </div>
        <div className="lg:col-span-7">
          <PreviewCard />
        </div>
      </div>
    </section>
  );
}
