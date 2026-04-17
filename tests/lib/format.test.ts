import { describe, it, expect } from "vitest";
import { formatUsd, formatPercent, formatRelativeTime, formatNumber } from "@/lib/format";

describe("format", () => {
  it("formatUsd renders en-US currency with 2 fraction digits", () => {
    expect(formatUsd(2481690.42)).toBe("$2,481,690.42");
    expect(formatUsd(0)).toBe("$0.00");
  });

  it("formatUsd supports optional signed prefix", () => {
    expect(formatUsd(12410.08, { signed: true })).toBe("+$12,410.08");
    expect(formatUsd(-50, { signed: true })).toBe("-$50.00");
  });

  it("formatPercent renders with sign and 2 decimals", () => {
    expect(formatPercent(0.005)).toBe("+0.50%");
    expect(formatPercent(-0.0123)).toBe("-1.23%");
  });

  it("formatRelativeTime returns seconds-ago string", () => {
    expect(formatRelativeTime(0.2)).toBe("0.2s ago");
    expect(formatRelativeTime(12)).toBe("12s ago");
  });

  it("formatNumber uses Intl.NumberFormat grouping", () => {
    expect(formatNumber(1234567.89, 2)).toBe("1,234,567.89");
    expect(formatNumber(38.412, 3)).toBe("38.412");
  });
});
