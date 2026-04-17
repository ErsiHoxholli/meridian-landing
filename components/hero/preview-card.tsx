"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Sparkline } from "./sparkline";
import { TickerNumber } from "./ticker-number";
import { useMeridianFeed } from "./use-meridian-feed";
import { formatNumber, formatPercent, formatUsd } from "@/lib/format";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return reduced;
}

export function PreviewCard() {
  const reduced = useReducedMotion();
  const snap = useMeridianFeed({ reducedMotion: reduced });
  const lastAnnouncedRef = useRef(0);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (reduced) return;
    const now = Date.now();
    if (now - lastAnnouncedRef.current < 10_000) return;
    lastAnnouncedRef.current = now;
    setAnnouncement(`Balance now ${formatUsd(snap.balance)}, ${snap.deltaPct >= 0 ? "up" : "down"} ${formatPercent(Math.abs(snap.deltaPct))} today.`);
  }, [snap.balance, snap.deltaPct, reduced]);

  return (
    <figure
      role="figure"
      aria-label="Live demo of the Meridian dashboard showing example account balances and activity. Values are simulated."
      className="relative overflow-hidden rounded-[--radius-lg] border border-border bg-bg-elevated shadow-[0_6px_24px_rgb(0_0_0/0.06)] dark:shadow-none"
      style={{ contentVisibility: "auto", containIntrinsicSize: "480px 420px" }}
    >
      <header className="flex h-12 items-center justify-between border-b border-border px-4">
        <span translate="no" className="font-mono text-xs text-fg-muted">
          meridian.al / treasury
        </span>
        <span className="flex items-center gap-2 font-mono text-xs text-fg-muted">
          <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-accent [animation:pulse_2s_ease-in-out_infinite] motion-reduce:animate-none" />
          Live
        </span>
      </header>

      <div className="space-y-6 px-6 py-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg-muted">Total Balance</p>
          <p className="mt-2 font-mono text-[44px] font-medium leading-none tracking-tight font-tabular">
            <TickerNumber value={formatUsd(snap.balance)} />
          </p>
          <p className="mt-2 flex items-center gap-1 font-mono text-sm text-accent-text font-tabular">
            <ArrowUpRight aria-hidden="true" size={14} />
            <span translate="no">
              {formatUsd(snap.deltaAbs, { signed: true })} ({formatPercent(snap.deltaPct)}) today
            </span>
          </p>
        </div>

        <div className="h-[60px]">
          <Sparkline values={snap.series} />
        </div>

        <ul className="grid grid-cols-3 gap-3 border-t border-border pt-5">
          {snap.assets.map((a) => (
            <li key={a.symbol} className="space-y-1.5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle" translate="no">{a.symbol}</p>
              <p className="font-mono text-sm font-tabular">
                {a.symbol === "USD" ? formatUsd(a.amount) : formatNumber(a.amount, a.symbol === "BTC" ? 5 : 3)}
              </p>
              <Sparkline values={a.micro} width={80} height={16} strokeWidth={1} />
              <p className={`font-mono text-[11px] font-tabular ${a.deltaPct >= 0 ? "text-accent-text" : "text-danger"}`}>
                {formatPercent(a.deltaPct)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <footer className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[11px] text-fg-subtle">
        <span>Synced · 0.2s ago</span>
        <span translate="no">Meridian</span>
      </footer>

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <style jsx>{`
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.35 } }
      `}</style>
    </figure>
  );
}
