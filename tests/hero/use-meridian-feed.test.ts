import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useMeridianFeed } from "@/components/hero/use-meridian-feed";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useMeridianFeed", () => {
  it("produces a deterministic initial snapshot for a fixed seed", () => {
    const a = renderHook(() => useMeridianFeed({ seed: 42, tickMs: 1000 }));
    const b = renderHook(() => useMeridianFeed({ seed: 42, tickMs: 1000 }));
    expect(a.result.current.balance).toBe(b.result.current.balance);
    expect(a.result.current.series).toEqual(b.result.current.series);
  });

  it("advances balance on tick", () => {
    const { result } = renderHook(() => useMeridianFeed({ seed: 1, tickMs: 1000 }));
    const before = result.current.balance;
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.balance).not.toBe(before);
  });

  it("keeps series length capped", () => {
    const { result } = renderHook(() => useMeridianFeed({ seed: 1, tickMs: 1000, seriesLength: 32 }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(result.current.series.length).toBeLessThanOrEqual(32);
  });

  it("does not advance when reducedMotion=true", () => {
    const { result } = renderHook(() => useMeridianFeed({ seed: 1, tickMs: 1000, reducedMotion: true }));
    const before = result.current.balance;
    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current.balance).toBe(before);
  });
});
