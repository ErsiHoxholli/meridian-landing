const METRICS = [
  { value: "$4.2B", label: "Settled in the last 12 months" },
  { value: "47", label: "Countries supported" },
  { value: "99.99%", label: "Rolling 90-day uptime" },
];

export function MetricsBand() {
  return (
    <section
      aria-labelledby="metrics-heading"
      className="mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-24"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 300px" }}
    >
      <h2 id="metrics-heading" className="sr-only">
        Platform metrics
      </h2>
      <dl className="grid gap-10 border-y border-border py-12 md:grid-cols-3">
        {METRICS.map((m) => (
          <div key={m.label} className="space-y-2">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">
              {m.label}
            </dt>
            <dd className="font-mono text-[clamp(2.5rem,5vw,4rem)] font-medium leading-none text-fg font-tabular">
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
