import Image from "next/image";

const LOGOS = Array.from({ length: 6 }, (_, i) => `/logos/logo-${i + 1}.svg`);

export function LogoStrip() {
  return (
    <section
      aria-labelledby="trusted-by"
      className="mx-auto max-w-[1280px] border-y border-border px-6 py-10 md:px-10"
    >
      <h2 id="trusted-by" className="sr-only">
        Trusted by
      </h2>
      <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
        {LOGOS.map((src) => (
          <li
            key={src}
            className="flex items-center justify-center text-fg-subtle"
          >
            <Image
              src={src}
              alt=""
              width={120}
              height={30}
              className="h-8 w-auto opacity-70 grayscale"
              loading="lazy"
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
