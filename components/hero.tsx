import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="w-full py-24 md:py-32 lg:py-40 bg-warmCream/20 relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
              Welcome to <br className="hidden sm:inline" />
              <span className="text-secondary">Dario's Corner</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg sm:text-xl text-foreground/80 leading-relaxed">
              A digital space where sophisticated design meets robust engineering. 
              Explore my portfolio, discover my process, and let's create something extraordinary together.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="bg-primary hover:bg-secondary text-white px-8">
              <Link href="#work">Explore My Work</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-accent text-primary hover:bg-accent/10 px-8">
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative background shape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-muted/30 rounded-full blur-3xl -z-10 pointer-events-none" aria-hidden="true" />
    </section>
  );
}