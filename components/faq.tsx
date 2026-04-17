"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is my money safe with Meridian?",
    a: "Cash sits in FDIC-insured partner banks, securities with an SEC-registered broker-dealer, and crypto with a qualified custodian. Meridian itself never takes custody.",
  },
  {
    q: "How are you regulated?",
    a: "We operate through partner banks (FDIC), a registered broker-dealer (SEC/FINRA), and a qualified custodian. Every partnership is listed in our Security page.",
  },
  {
    q: "Can I move money between asset classes?",
    a: "Yes. Cash to equities settles the same business day; cash to crypto settles within minutes. Moves appear as unified journal entries in your ledger.",
  },
  {
    q: "Do you support multiple entities?",
    a: "Business tier supports multi-entity structures with intercompany transfers, separate ledgers, and consolidated reporting.",
  },
  {
    q: "What about taxes?",
    a: "Meridian tracks tax lots across equities and crypto. At year-end, export a 1099 / gain-loss CSV ready for your accountant or tax software.",
  },
  {
    q: "Is there an API?",
    a: "Yes — one REST + webhook API covers every asset class. No separate broker, bank, and custody APIs to glue together.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="mx-auto max-w-[1280px] border-t border-border px-6 py-24 md:px-10 md:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">
          FAQ
        </p>
        <h2 className="mt-5 font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
          Answers up front.
        </h2>
      </header>
      <Accordion
        type="single"
        collapsible
        className="mt-10 divide-y divide-border border-t border-border"
      >
        {FAQS.map((item, i) => (
          <AccordionItem key={item.q} value={`faq-${i}`} className="border-0">
            <AccordionTrigger className="py-6 text-left font-serif text-lg font-semibold hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-fg-muted">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
