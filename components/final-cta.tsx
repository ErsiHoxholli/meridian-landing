"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FinalCta() {
  const id = useId();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        body: new URLSearchParams({ email: String(email ?? "") }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="waitlist" className="border-t border-border">
      <div className="mx-auto max-w-[1280px] px-6 py-28 md:px-10 md:py-40 text-center">
        <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-tight text-balance">
          The account you&apos;ll{" "}
          <em className="italic text-accent-text">actually</em> keep.
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] text-lg text-fg-muted">
          Request early access. We&apos;re onboarding teams and individuals in
          small batches.
        </p>
        <form
          onSubmit={onSubmit}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          noValidate
        >
          <label htmlFor={id} className="sr-only">
            Email address
          </label>
          <Input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            required
            placeholder="you@company.com"
            className="h-12 flex-1"
            aria-describedby={error ? `${id}-err` : undefined}
            aria-invalid={status === "error" ? true : undefined}
          />
          <Button
            type="submit"
            size="lg"
            disabled={status === "loading"}
            aria-busy={status === "loading"}
          >
            {status === "loading" ? "Requesting…" : "Request Access"}
          </Button>
        </form>
        <div className="mt-4 min-h-6 text-sm" aria-live="polite">
          {status === "success" && (
            <p role="status" className="text-accent-text">
              You&apos;re on the list. We&apos;ll be in touch.
            </p>
          )}
          {status === "error" && (
            <p id={`${id}-err`} role="alert" className="text-danger">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
