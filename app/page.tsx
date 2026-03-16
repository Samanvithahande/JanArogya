import { LandingNavbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { CareFlowSection, ImpactSection } from "@/components/landing/process-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="landing-page min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CareFlowSection />
        <ImpactSection />
      </main>
      <Footer />
    </div>
  )
}
