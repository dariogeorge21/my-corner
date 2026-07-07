import Hero from "@/components/sections/hero"
import Bio from "@/components/sections/bio"
import FeaturedWork from "@/components/sections/featured-work"
import TechStack from "@/components/sections/tech-stack"
import Contact from "@/components/sections/contact"
import Services from "@/components/sections/services"

export default function Home() {
  return (
    <div className="flex flex-col gap-24 md:gap-32">
      <Hero />
      <Bio />
      <Services />
      <FeaturedWork />
      <TechStack />
      <Contact />

      {/* You can add TechStack and Contact components here following the same spatial patterns */}
    </div>
  )
}