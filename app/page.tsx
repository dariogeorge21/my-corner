import Hero from "@/components/hero"
import Bio from "@/components/bio"
import FeaturedWork from "@/components/featured-work"
import TechStack from "@/components/tech-stack"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <div className="flex flex-col gap-24 md:gap-32">
      <Hero />
      <Bio />
      <FeaturedWork />
      <TechStack />
      <Contact />

      {/* You can add TechStack and Contact components here following the same spatial patterns */}
    </div>
  )
}