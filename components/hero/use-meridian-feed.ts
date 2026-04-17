"use client";

import { useEffect, useRef, useState } from "react";
import { mulberry32 } from "@/lib/prng";

export interface MeridianSnapshot {
  balance: number;
  deltaAbs: number;
  deltaPct: number;
  series: number[];
  syncedSecondsAgo: number;
  assets: Array<{ symbol: string; amount: number; deltaPct: number; micro: number[] }>;
}

export interface FeedOptions {
  seed?: number;
  tickMs?: number;
  seriesLength?: number;
  reducedMotion?: boolean;
}

const BASE_BALANCE = 2_481_690.42;
const SYMBOLS = ["USD", "AAPL", "BTC"] as const;

function buildInitial(seed: number, seriesLength: number): MeridianSnapshot {
  const rand = mulberry32(seed);
  const series: number[] = [];
  let v = 50;
  for (let i = 0; i < seriesLength; i++) {
    v += (rand() - 0.48) * 3;
    series.push(v);
  }
  const assets = SYMBOLS.map((symbol, i) => {
    const micro: number[] = [];
    let m = 50;
    for (let j = 0; j < 20; j++) {
      m += (rand() - 0.5) * 4;
      micro.push(m);
    }
    const amount = [412_009.0, 38.412, 0.28481][i]!;
    const deltaPct = (rand() - 0.3) * 0.02;
    return { symbol, amount, deltaPct, micro };
  });
  return {
    balance: BASE_BALANCE,
    deltaAbs: 12_410.08,
    deltaPct: 0.005,
    series,
    syncedSecondsAgo: 0.2,
    assets,
  };
}

export function useMeridianFeed(opts: FeedOptions = {}): MeridianSnapshot {
  const { seed = 42, tickMs = 4000, seriesLength = 64, reducedMotion = false } = opts;
  const [snap, setSnap] = useState<MeridianSnapshot>(() => buildInitial(seed, seriesLength));
  const randRef = useRef(mulberry32(seed + 1));

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      setSnap((prev) => {
        const rand = randRef.current;
        const nextBalanceDelta = (rand() - 0.4) * 5000;
        const nextBalance = prev.balance + nextBalanceDelta;
        const lastSeries = prev.series[prev.series.length - 1] ?? 50;
        const nextPoint = lastSeries + (rand() - 0.48) * 3;
        const nextSeries = prev.series.slice(1).concat(nextPoint);
        const touchedIndex = Math.floor(rand() * prev.assets.length);
        const nextAssets = prev.assets.map((a, i) =>
          i === touchedIndex ? { ...a, deltaPct: a.deltaPct + (rand() - 0.5) * 0.002 } : a
        );
        return {
          balance: nextBalance,
          deltaAbs: prev.deltaAbs + nextBalanceDelta,
          deltaPct: (nextBalance - BASE_BALANCE) / BASE_BALANCE,
          series: nextSeries,
          syncedSecondsAgo: 0.2,
          assets: nextAssets,
        };
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [tickMs, reducedMotion]);

  return snap;
}
