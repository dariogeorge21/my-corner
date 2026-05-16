import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Bio } from "@/components/bio";
import { TechStack } from "@/components/tech-stack";
import { FeaturedWork } from "@/components/featured-work";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Bio />
        <TechStack />
        <FeaturedWork />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}