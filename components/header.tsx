import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight text-primary">Dario's Corner</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#about" className="transition-colors hover:text-secondary text-foreground/80">About</Link>
          <Link href="#tech-stack" className="transition-colors hover:text-secondary text-foreground/80">Tech Stack</Link>
          <Link href="#work" className="transition-colors hover:text-secondary text-foreground/80">Work</Link>
          <Link href="#contact" className="transition-colors hover:text-secondary text-foreground/80">Contact</Link>
        </nav>
        <div className="flex items-center">
          <Button asChild variant="default" className="bg-primary text-primary-foreground hover:bg-secondary">
            <Link href="#contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}