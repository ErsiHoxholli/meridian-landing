import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  LineChart,
  Bitcoin,
  CreditCard,
  SendHorizontal,
  Code2,
} from "lucide-react";

const TILES = [
  {
    icon: Banknote,
    title: "Treasury",
    desc: "Operate runway, payroll, and vendor cash across entities.",
  },
  {
    icon: LineChart,
    title: "Trading",
    desc: "Equities and ETFs with fractional shares and tax-lot tracking.",
  },
  {
    icon: Bitcoin,
    title: "Crypto",
    desc: "Spot holdings in qualified custody with on-chain settlement.",
  },
  {
    icon: CreditCard,
    title: "Cards",
    desc: "Physical and virtual corporate cards with real-time controls.",
  },
  {
    icon: SendHorizontal,
    title: "Wires",
    desc: "Same-day wires and ACH, domestic and international.",
  },
  {
    icon: Code2,
    title: "API",
    desc: "A single REST + webhook API across every asset class.",
  },
];

export function CapabilityGrid() {
  return (
    <section
      id="capabilities"
      className="mx-auto max-w-[1280px] border-t border-border px-6 py-24 md:px-10 md:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">
          Capabilities
        </p>
        <h2 className="mt-5 font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
          Everything you&apos;d expect — in one ledger.
        </h2>
      </header>
      <ul className="mt-12 grid grid-cols-1 gap-0 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(({ icon: Icon, title, desc }) => (
          <li
            key={title}
            className="group relative border-b border-border p-8 sm:[&:nth-child(odd)]:border-r lg:[&:not(:nth-child(3n))]:border-r"
          >
            <Icon aria-hidden="true" size={20} className="text-fg-muted" />
            <h3 className="mt-5 font-serif text-xl font-bold">{title}</h3>
            <p className="mt-2 max-w-[34ch] text-sm text-fg-muted">{desc}</p>
            <Link
              href="#"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-fg hover:text-accent-text"
            >
              Learn more <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
