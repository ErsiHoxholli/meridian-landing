import { ShieldCheck, Landmark, Scale, Lock } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "SOC 2 Type II" },
  { icon: Landmark, label: "FDIC partner banks" },
  { icon: Scale, label: "SEC-registered broker-dealer" },
  { icon: Lock, label: "Qualified crypto custody" },
];

export function SecurityStrip() {
  return (
    <section
      id="security"
      aria-labelledby="security-heading"
      className="border-y border-border bg-bg-elevated"
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-6 px-6 py-6 md:px-10">
        <h2 id="security-heading" className="sr-only">
          Security and compliance
        </h2>
        {BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-sm text-fg-muted"
          >
            <Icon aria-hidden="true" size={16} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
