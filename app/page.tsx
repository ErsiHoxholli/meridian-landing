import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero/hero";
import { LogoStrip } from "@/components/logo-strip";
import { DualThread } from "@/components/dual-thread";
import { CapabilityGrid } from "@/components/capability-grid";
import { HowItWorks } from "@/components/how-it-works";
import { SecurityStrip } from "@/components/security-strip";
import { MetricsBand } from "@/components/metrics-band";
import { Testimonial } from "@/components/testimonial";
import { PricingTeaser } from "@/components/pricing-teaser";
import { FAQ } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <DualThread />
        <CapabilityGrid />
        <HowItWorks />
        <SecurityStrip />
        <MetricsBand />
        <Testimonial />
        <PricingTeaser />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
