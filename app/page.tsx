import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import Bio from "@/components/sections/bio";
import FeaturedWork from "@/components/sections/featured-work";
import TechStack from "@/components/sections/tech-stack";
import Contact from "@/components/sections/contact";
import Services from "@/components/sections/services";

// ─── Page-level Metadata ──────────────────────────────────────────────────────
/**
 * Primary keyword:  "website developer Delhi"
 * Related:          "website developer Kerala", "web app developer India"
 * Semantic:         "custom websites", "Next.js", "freelance", "PC repair"
 *
 * This metadata is merged with (and overrides) the root layout metadata for
 * the homepage.  The `title.default` from layout is used automatically for all
 * other pages that don't export their own metadata.
 */
export const metadata: Metadata = {
  title:
    "Dario George | Website Developer in Delhi & Kerala – Custom Web Apps & PC Repair",
  description:
    "Hi, I'm Dario George – a freelance website developer in Delhi and Kerala. I craft custom websites, full-stack Next.js web applications, technical documentation, and offer on-site PC hardware support across Delhi NCR. Serving clients pan-India.",
  alternates: {
    canonical: "https://dariogeorge.in",
  },
  openGraph: {
    title:
      "Dario George | Website Developer in Delhi & Kerala – Custom Web Apps & PC Repair",
    description:
      "Freelance website developer in Delhi and Kerala. Custom websites, Next.js web applications, and PC hardware support for businesses across India.",
    url: "https://dariogeorge.in",
    type: "website",
  },
};

// ─── Homepage ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="flex flex-col gap-24 md:gap-32">
      {/* Hero — above-the-fold first impression */}
      <Hero />

      {/* Bio — who is Dario George */}
      <Bio />

      {/* Services — website development, documentation, PC repair */}
      <Services />

      {/* Featured Work — portfolio of shipped projects */}
      <FeaturedWork />

      {/* Tech Stack — technologies used */}
      <TechStack />

      {/* Contact — get in touch */}
      <Contact />
    </div>
  );
}