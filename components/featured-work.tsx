import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ExternalLink } from "lucide-react";

export function FeaturedWork() {
  const projects = [
    {
      title: "E-Commerce Platform Redesign",
      description: "A complete overhaul of a legacy e-commerce system resulting in a 40% increase in conversion rates. Built with Next.js, Stripe, and Tailwind CSS.",
      tags: ["Next.js", "React", "Tailwind CSS", "Stripe API"],
      link: "#"
    },
    {
      title: "FinTech Dashboard Analytics",
      description: "An intuitive data visualization dashboard for financial analysts. Features real-time updates, complex filtering, and interactive charting.",
      tags: ["TypeScript", "Recharts", "WebSockets", "Zustand"],
      link: "#"
    }
  ];

  return (
    <section id="work" className="w-full py-20 lg:py-32 bg-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">Featured Work</h2>
            <div className="w-20 h-1 bg-secondary rounded-full"></div>
            <p className="max-w-[600px] text-foreground/80 mt-4 text-lg">
              A selection of recent projects that showcase my approach to solving complex problems through elegant design.
            </p>
          </div>
          <Button asChild variant="ghost" className="text-secondary hover:text-primary hover:bg-muted/50 font-medium group px-0 md:px-4">
            <Link href="#portfolio" className="flex items-center gap-2">
              View All Projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden border-accent/20 hover:border-secondary hover:shadow-lg transition-all duration-300 flex flex-col bg-white">
              <div className="aspect-video w-full bg-muted/40 relative overflow-hidden flex items-center justify-center p-8">
                {/* Fallback image placeholder */}
                <div className="w-full h-full bg-background rounded-lg border-2 border-dashed border-accent/30 flex items-center justify-center text-accent">
                  <span className="font-medium">Project Preview {index + 1}</span>
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base text-foreground/80 leading-relaxed mb-6">
                    {project.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild variant="outline" className="w-full sm:w-auto border-accent text-primary hover:bg-primary hover:text-white transition-colors">
                    <Link href={project.link} className="flex items-center gap-2">
                      View Project <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}