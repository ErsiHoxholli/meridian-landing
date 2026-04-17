import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    features: ["Personal balance view", "2 linked accounts", "Basic charts"],
  },
  {
    name: "Pro",
    price: "$18",
    cadence: "/ month",
    features: [
      "Unlimited accounts",
      "Tax-lot tracking",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Business",
    price: "Talk to us",
    cadence: "",
    features: [
      "Multi-entity treasury",
      "Approval flows, SSO, SOC 2 exports",
      "Dedicated solutions engineer",
    ],
  },
];

export function PricingTeaser() {
  return (
    <section
      id="pricing"
      className="mx-auto max-w-[1280px] border-t border-border px-6 py-24 md:px-10 md:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">
          Pricing
        </p>
        <h2 className="mt-5 font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
          Straightforward at every tier.
        </h2>
      </header>
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <li
            key={t.name}
            className={`flex flex-col rounded-[--radius-lg] border p-8 ${
              t.highlight ? "border-fg bg-bg-elevated" : "border-border"
            }`}
          >
            <p className="font-serif text-lg font-bold">{t.name}</p>
            <p className="mt-4 font-serif text-4xl font-bold font-tabular">
              {t.price}
              {t.cadence && (
                <span className="ml-1 font-sans text-base font-normal text-fg-muted">
                  {t.cadence}
                </span>
              )}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-fg-muted">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check
                    aria-hidden="true"
                    size={16}
                    className="mt-[2px] shrink-0 text-accent-text"
                  />
                  <span className="min-w-0">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#"
              className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-fg hover:text-accent-text"
            >
              See full pricing <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
