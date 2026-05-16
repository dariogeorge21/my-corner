import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Bio() {
  return (
    <section id="about" className="w-full py-20 lg:py-32">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-muted">
              {/* Fallback avatar block if image is not present */}
              <div className="absolute inset-0 bg-accent/20 flex items-center justify-center text-primary font-bold text-4xl">
                {/* <Image src="/avatar.jpg" alt="Dario" fill className="object-cover" /> */}
                Dario
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">About Me</h2>
              <div className="w-20 h-1 bg-secondary mx-auto lg:mx-0 rounded-full"></div>
            </div>
            
            <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
              <p>
                Hi, I'm Dario. I'm a passionate developer and designer dedicated to crafting elegant, 
                user-centric digital experiences. I believe that complexity should operate quietly under 
                the surface, leaving users with intuitive, seamless interfaces.
              </p>
              <p>
                My professional journey has been focused on bridging the gap between sophisticated 
                minimalism and approachable warmth. From robust web applications to engaging landing pages, 
                I thrive on transforming ideas into impactful digital realities.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Button asChild variant="outline" size="icon" className="rounded-full rounded-full border-accent hover:bg-accent hover:text-white transition-colors">
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon" className="rounded-full border-accent hover:bg-accent hover:text-white transition-colors">
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon" className="rounded-full border-accent hover:bg-accent hover:text-white transition-colors">
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="pt-6">
              <Button asChild variant="link" className="text-secondary hover:text-primary pl-0 text-lg group">
                <Link href="#work" className="flex items-center gap-2">
                  View Full Portfolio 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}