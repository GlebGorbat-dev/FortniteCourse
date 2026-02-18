import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import CoursesPreview from '@/components/landing/CoursesPreview'
import CTA from '@/components/landing/CTA'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CoursesPreview />
      <CTA />
    </main>
  )
}

