import Link from "next/link";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-primary text-primary-foreground">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-bold text-2xl tracking-tight text-white">Dario's Corner</span>
            </Link>
            <p className="opacity-80 max-w-sm text-muted">
              A digital space where sophisticated design meets robust engineering. Let's create something extraordinary together.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="#about" className="opacity-80 hover:opacity-100 hover:text-muted transition-colors">About</Link>
              <Link href="#tech-stack" className="opacity-80 hover:opacity-100 hover:text-muted transition-colors">Tech Stack</Link>
              <Link href="#work" className="opacity-80 hover:opacity-100 hover:text-muted transition-colors">Work</Link>
              <Link href="#contact" className="opacity-80 hover:opacity-100 hover:text-muted transition-colors">Contact</Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Connect</h4>
            <div className="flex gap-4">
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 bg-white/10 rounded-full hover:bg-muted hover:text-primary transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 bg-white/10 rounded-full hover:bg-muted hover:text-primary transition-colors">
                <FaGithub className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 bg-white/10 rounded-full hover:bg-muted hover:text-primary transition-colors">
                <FaTwitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
          <p>© {currentYear} Dario. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}