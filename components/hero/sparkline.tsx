"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";

interface Props {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
  strokeWidth?: number;
}

export function Sparkline({ values, width = 240, height = 60, className, ariaLabel, strokeWidth = 1.5 }: Props) {
  const { path, area, last, first } = useMemo(() => {
    if (values.length < 2) return { path: "", area: "", last: 0, first: 0 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const step = width / (values.length - 1);
    const points = values.map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / span) * height;
      return [x, y] as const;
    });
    const d = points.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
    const areaD = `${d} L${width},${height} L0,${height} Z`;
    return { path: d, area: areaD, last: points[points.length - 1]![1], first: points[0]![1] };
  }, [values, width, height]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)" />
      <path
        d={path}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={0} cy={first} r={2} fill="var(--color-accent)" opacity="0.4" />
      <circle cx={width} cy={last} r={3} fill="var(--color-accent)" />
    </svg>
  );
}
