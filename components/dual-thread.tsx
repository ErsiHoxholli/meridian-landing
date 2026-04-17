import { Check } from "lucide-react";

const COLUMNS = [
  {
    eyebrow: "For businesses",
    heading: "Company money, consolidated.",
    points: [
      "Multi-entity treasury with intercompany transfers",
      "FDIC-insured cash + SEC-registered brokerage + qualified custody",
      "Approval flows, role-based access, SOC 2 audit trails",
    ],
  },
  {
    eyebrow: "For individuals",
    heading: "Personal wealth, one view.",
    points: [
      "Checking, brokerage, and crypto under a single balance",
      "Tax-lot tracking across asset classes — cap gains in real time",
      "Private by design: no data resale, no advertising model",
    ],
  },
];

export function DualThread() {
  return (
    <section
      id="product"
      className="mx-auto max-w-[1280px] px-6 py-24 md:px-10 md:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 600px" }}
    >
      <div className="grid gap-16 md:grid-cols-2 md:gap-12">
        {COLUMNS.map((col) => (
          <article
            key={col.eyebrow}
            className="space-y-6 border-t border-border pt-8"
          >
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">
              {col.eyebrow}
            </p>
            <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
              {col.heading}
            </h2>
            <ul className="space-y-4">
              {col.points.map((p) => (
                <li key={p} className="flex gap-3 text-fg-muted">
                  <Check
                    aria-hidden="true"
                    size={18}
                    className="mt-1 shrink-0 text-accent-text"
                  />
                  <span className="min-w-0">{p}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
