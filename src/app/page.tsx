import { Header } from "@/components/header";
import { InteractiveContent } from "@/components/interactive-content";
import { FaqSection } from "@/components/faq-section";
import { MethodologySection } from "@/components/methodology-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="hero-glow">
          <div className="max-w-2xl mx-auto px-5 pt-12 pb-10 sm:pt-16 sm:pb-12">
            <section className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight leading-tight">
                Is aircon worth it where you live?
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                Enter your postcode. We&apos;ll check six years of
                overnight temperatures and tell you straight.
              </p>
            </section>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-5 pb-16 space-y-14">
          <InteractiveContent />

          <div className="border-t" />
          <FaqSection />
          <div className="border-t" />
          <MethodologySection />
        </div>
      </main>
      <Footer />
    </>
  );
}
