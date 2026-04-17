export function Testimonial() {
  return (
    <section
      aria-labelledby="quote-heading"
      className="mx-auto max-w-[1280px] border-t border-border px-6 py-24 md:px-10 md:py-32"
    >
      <h2 id="quote-heading" className="sr-only">
        Customer testimonial
      </h2>
      <figure className="mx-auto max-w-3xl text-center">
        <blockquote className="font-serif italic text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.2] tracking-tight text-balance">
          &ldquo;We replaced a spreadsheet, a broker, and two wallets with
          Meridian. My finance team got their Fridays back.&rdquo;
        </blockquote>
        <figcaption className="mt-8 text-sm text-fg-muted">
          <span translate="no">Iris Moreau</span> — CFO,{" "}
          <span translate="no">Latticeworks</span>
        </figcaption>
      </figure>
    </section>
  );
}
