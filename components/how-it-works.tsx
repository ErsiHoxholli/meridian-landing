const STEPS = [
  {
    n: "01",
    title: "Connect",
    desc: "Link existing bank, broker, and wallet accounts in minutes.",
  },
  {
    n: "02",
    title: "Consolidate",
    desc: "Every asset lives behind one unified balance and ledger.",
  },
  {
    n: "03",
    title: "Control",
    desc: "Move, invest, and report across asset classes without leaving.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-[1280px] border-t border-border px-6 py-24 md:px-10 md:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
    >
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">
          How it works
        </p>
        <h2 className="mt-5 font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
          Three steps. One ledger.
        </h2>
      </header>
      <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((s) => (
          <li key={s.n} className="border-t border-border pt-6">
            <p className="font-mono text-xs text-fg-subtle font-tabular">{s.n}</p>
            <h3 className="mt-3 font-serif text-2xl font-bold">{s.title}</h3>
            <p className="mt-3 text-fg-muted">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
