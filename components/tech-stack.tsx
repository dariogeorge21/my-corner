export function TechStack() {
  const technologies = [
    "TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", 
    "GraphQL", "PostgreSQL", "GitHub", "Figma", "Vercel",
    // Duplicate to ensure smooth scrolling
    "TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", 
    "GraphQL", "PostgreSQL", "GitHub", "Figma", "Vercel"
  ];

  return (
    <section id="tech-stack" className="w-full py-16 bg-muted/30 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-2xl font-bold text-center text-primary mb-2">Technologies & Tools</h2>
        <div className="w-16 h-1 bg-accent mx-auto rounded-full"></div>
      </div>
      
      {/* Marquee container */}
      <div className="relative w-full flex overflow-hidden whitespace-nowrap group">
        <div className="animate-marquee flex flex-row items-center gap-8 py-4 px-4 min-w-full [--duration:40s] [--gap:2rem] group-hover:[animation-play-state:paused]">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="flex items-center justify-center px-6 py-3 bg-white rounded-lg shadow-sm border border-accent/20 
                         text-primary font-medium transition-transform hover:scale-105 hover:border-secondary hover:shadow-md cursor-default"
            >
              {tech}
            </div>
          ))}
        </div>
        {/* Second marquee for seamless looping */}
        <div className="animate-marquee flex flex-row items-center gap-8 py-4 px-4 min-w-full absolute top-0 left-full [--duration:40s] [--gap:2rem] group-hover:[animation-play-state:paused]">
          {technologies.map((tech, index) => (
            <div 
              key={`dup-${index}`}
              className="flex items-center justify-center px-6 py-3 bg-white rounded-lg shadow-sm border border-accent/20 
                         text-primary font-medium transition-transform hover:scale-105 hover:border-secondary hover:shadow-md cursor-default"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}