import HeroSection from "../../landing/components/HeroSection"
import PlatformHighlights from "../../landing/components/PlatformHighlights"
import HowItWorks from "../../landing/components/HowItWorks"
import PlatformStatistics from "../../landing/components/PlatformStatistics"
import TestimonialsCarousel from "../../landing/components/TestimonialsCarousel"
import FooterSection from "../../landing/components/FooterSection"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Highlights Grid */}
      <PlatformHighlights />

      {/* How It Works Timeline */}
      <HowItWorks />

      {/* Statistics Section */}
      <PlatformStatistics />

      {/* Testimonials Marquee Carousel */}
      <TestimonialsCarousel />

      {/* Generic Footer Section */}
      <FooterSection />
    </div>
  )
}
