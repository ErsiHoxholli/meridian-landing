const usdBase = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(value: number, opts?: { signed?: boolean }): string {
  const abs = usdBase.format(Math.abs(value));
  if (!opts?.signed) return value < 0 ? `-${abs}` : abs;
  return value < 0 ? `-${abs}` : `+${abs}`;
}

export function formatPercent(ratio: number): string {
  const pct = (ratio * 100).toFixed(2);
  const n = Number(pct);
  return `${n >= 0 ? "+" : ""}${pct}%`;
}

export function formatRelativeTime(secondsAgo: number): string {
  if (secondsAgo < 10) return `${secondsAgo.toFixed(1)}s ago`;
  return `${Math.round(secondsAgo)}s ago`;
}

export function formatNumber(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
