'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import LogoLoop from './LogoLoop';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPostgresql,
  SiSupabase,
  SiArchlinux,
  SiGit,
  SiGithub,
  SiJavascript,
  SiPrisma,
  SiDocker,
  SiPython,
  SiMarkdown,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiFramer,
  SiVercel,
  SiEslint,
  SiPostcss,
} from 'react-icons/si';

const techLogos = [
  { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org' },
  { node: <SiReact />, title: 'React', href: 'https://react.dev' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },

  { node: <SiPostgresql />, title: 'PostgreSQL', href: 'https://www.postgresql.org' },
  { node: <SiSupabase />, title: 'Supabase', href: 'https://supabase.com' },
  // { node: <SiNeon />, title: 'Neon', href: 'https://neon.tech' },

  { node: <SiFramer />, title: 'Framer Motion', href: 'https://www.framer.com/motion' },
  { node: <SiVercel />, title: 'Vercel', href: 'https://vercel.com' },

  { node: <SiArchlinux />, title: 'Arch Linux', href: 'https://archlinux.org' },
  { node: <SiGit />, title: 'Git', href: 'https://git-scm.com' },
  { node: <SiGithub />, title: 'GitHub', href: 'https://github.com' },
  // { node: <SiWindows11 />, title: 'Windows', href: 'https://www.microsoft.com/windows' },

  { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { node: <SiPrisma />, title: 'Prisma', href: 'https://www.prisma.io' },
  { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com' },
  { node: <SiEslint />, title: 'ESLint', href: 'https://eslint.org' },
  { node: <SiPostcss />, title: 'PostCSS', href: 'https://postcss.org' },

  { node: <SiPython />, title: 'Python', href: 'https://www.python.org' },
  // { node: <SiBash />, title: 'Bash', href: 'https://www.gnu.org/software/bash/' },
  { node: <SiMarkdown />, title: 'Markdown', href: 'https://www.markdownguide.org' },
  { node: <SiHtml5 />, title: 'HTML5', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { node: <SiCss />, title: 'CSS3', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org' },
];

export default function TechStack() {
  const [isHovered, setIsHovered] = useState(false);

  // Extract tech names for the text scroller
  const techNames = techLogos.map(tech => tech.title);
  const scrollText = techNames.join(' • ') + ' • ';

  return (
    <div className="w-full flex flex-col">
      {/* Logo Loop Section */}
      <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
        <LogoLoop
          logos={techLogos}
          speed={200}
          direction="left"
          logoHeight={60}
          gap={60}
          hoverSpeed={20}
          scaleOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="My tech stack"
        />
      </div>

      {/* Tech Stack Text Scroller */}
      <div className="border-t mt-[-100px] border-b border-foreground/10 py-6 overflow-hidden">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-center w-max"
          animate={{
            x: [0, -2000],
            scale: isHovered ? 1 : 1,
          }}
          transition={{
            x: {
              duration: isHovered ? 100 : 20,
              repeat: Infinity,
              ease: 'linear',
              repeatType: 'loop',
            },
            scale: {
              duration: 0.3,
              ease: 'easeOut',
            },
          }}
        >
          {/* Render text twice for seamless loop */}
          {[0, 1].map((index) => (
            <div
              key={index}
              className="flex items-center gap-6 whitespace-nowrap px-4"
            >
              <span className="font-mono text-5xl md:text-4xl tracking-[0.2em] uppercase font-medium text-foreground/60 transition-all duration-300"
                style={{
                  opacity: isHovered ? 0.9 : 0.6,
                  color: isHovered ? 'var(--accent)' : 'inherit',
                }}
              >
                {scrollText}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}