import Link from "next/link";
import { Wordmark } from "./wordmark";
import { ThemeToggle } from "./theme-toggle";

const COLUMNS = [
  { heading: "Product", links: ["Treasury", "Trading", "Crypto", "Cards", "API"] },
  { heading: "Company", links: ["About", "Careers", "Press", "Contact"] },
  { heading: "Resources", links: ["Docs", "Changelog", "Security", "Status"] },
  { heading: "Legal", links: ["Privacy", "Terms", "Disclosures", "Complaints"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-[32ch] text-sm text-fg-muted">
              Treasury, brokerage, and crypto in a single ledger.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <nav key={c.heading} aria-label={c.heading}>
              <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">
                {c.heading}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-fg hover:text-accent-text">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-xs text-fg-subtle">
          <p>
            © {new Date().getFullYear()}{" "}
            <span translate="no">Meridian</span>. Banking services via FDIC
            partner banks. Brokerage via an SEC-registered broker-dealer.
            Crypto custody via qualified custodian. Not investment advice.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
