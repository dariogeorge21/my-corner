'use client';

import { motion, useScroll, useVelocity, useSpring, useTransform, useMotionValue, useAnimationFrame, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
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
import { 
  FaDatabase, 
  FaWindows, 
  FaDesktop,
  FaLaptop,
  FaMicrochip,
  FaHdd } from 'react-icons/fa';

const techLogos = [
  { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org' },
  { node: <SiReact />, title: 'React', href: 'https://react.dev' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { node: <SiPostgresql />, title: 'PostgreSQL', href: 'https://www.postgresql.org' },
  { node: <SiSupabase />, title: 'Supabase', href: 'https://supabase.com' },
  { node: <SiFramer />, title: 'Framer Motion', href: 'https://www.framer.com/motion' },
  { node: <SiVercel />, title: 'Vercel', href: 'https://vercel.com' },
  { node: <SiArchlinux />, title: 'Arch Linux', href: 'https://archlinux.org' },
  { node: <SiGit />, title: 'Git', href: 'https://git-scm.com' },
  { node: <SiGithub />, title: 'GitHub', href: 'https://github.com' },
  { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { node: <SiPrisma />, title: 'Prisma', href: 'https://www.prisma.io' },
  { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com' },
  { node: <SiEslint />, title: 'ESLint', href: 'https://eslint.org' },
  { node: <SiPostcss />, title: 'PostCSS', href: 'https://postcss.org' },
  { node: <SiPython />, title: 'Python', href: 'https://www.python.org' },
  { node: <SiMarkdown />, title: 'Markdown', href: 'https://www.markdownguide.org' },
  { node: <SiHtml5 />, title: 'HTML5', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { node: <SiCss />, title: 'CSS3', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org' },
  { node: <FaDatabase />, title: 'Databases', href: 'https://en.wikipedia.org/wiki/Database' },
  { node: <FaWindows />, title: 'Windows', href: 'https://www.microsoft.com/windows' },
  { node: <FaDesktop />, title: 'Desktop', href: 'https://en.wikipedia.org/wiki/Desktop_computer' },
  { node: <FaLaptop />, title: 'Laptop', href: 'https://en.wikipedia.org/wiki/Laptop' },
  { node: <FaMicrochip />, title: 'Hardware', href: 'https://en.wikipedia.org/wiki/Microchip' },
  { node: <FaHdd />, title: 'Storage', href: 'https://en.wikipedia.org/wiki/Hard_disk_drive' },
  ];

export default function TechStack() {
  const [isHovered, setIsHovered] = useState(false);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Scroll velocity tracking
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 3], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-800, 800], [4, -4]);

  // Base speed for text marquee (pixels per second)
  const baseSpeed = 150;
  // Direction: negative = left
  const direction = -1;

  // Motion value for X offset
  const offsetX = useMotionValue(0);

  // Smooth speed multiplier
  const speedMultiplier = useSpring(1, { damping: 50, stiffness: 400 });

  useEffect(() => {
    speedMultiplier.set(isHovered ? 0.3 : 1);
  }, [isHovered, speedMultiplier]);

  // Update content width when text changes or on resize
  useEffect(() => {
    if (!textContentRef.current) return;
    const updateWidth = () => {
      if (textContentRef.current) {
        setContentWidth(textContentRef.current.scrollWidth / 2); // Because we duplicate twice
      }
    };
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(textContentRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Animation loop for continuous marquee with velocity factor
  useAnimationFrame((t, delta) => {
    if (shouldReduceMotion) return;
    if (contentWidth === 0) return;

    let speed = baseSpeed;
    // Apply scroll velocity factor (max 3x)
    const factor = velocityFactor.get();
    speed += baseSpeed * factor;
    // Apply smooth hover multiplier
    speed *= speedMultiplier.get();

    let newX = offsetX.get() + direction * speed * (delta / 1000);
    // Wrap around
    if (newX <= -contentWidth) {
      newX += contentWidth;
    } else if (newX > 0) {
      newX -= contentWidth;
    }
    offsetX.set(newX);
  });

  // Extract tech names for the text scroller
  const techNames = techLogos.map(tech => tech.title);
  const scrollText = techNames.join(' • ') + ' • ';

  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 20, y: 50 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col perspective-container"
      style={{ perspective: shouldReduceMotion ? 'none' : '1000px' }}
    >
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

      {/* Tech Stack Text Scroller - Glassmorphic Overlay */}
      <div
        ref={textContainerRef}
        className="border-t mt-[-100px] border-b border-foreground/10 overflow-hidden relative z-10"
      >
        {/* Glass background with backdrop blur */}
        <div className="absolute inset-0 bg-background/40 dark:bg-background/60 backdrop-blur-md" />
        
        {/* Dividing line that expands on load */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent origin-left"
        />
        
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="py-6 overflow-hidden relative"
          style={{ skewX }}
        >
          <motion.div
            ref={textContentRef}
            className="flex items-center w-max will-change-transform"
            style={{ x: offsetX }}
          >
            {/* Render text twice for seamless loop */}
            {[0, 1].map((index) => (
              <div
                key={index}
                className="flex items-center gap-6 whitespace-nowrap px-4"
              >
                <span
                  className={`
                    font-mono text-5xl md:text-4xl tracking-[0.2em] uppercase font-medium 
                    transition-all duration-300
                    ${isHovered ? 'text-accent' : 'text-foreground/40'}
                    ${isHovered ? 'drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]' : ''}
                  `}
                  style={{
                    textShadow: isHovered ? '0 0 8px rgba(var(--accent-rgb), 0.5)' : 'none',
                  }}
                >
                  {scrollText}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .perspective-container {
          perspective: 1000px;
        }
        @media (max-width: 1024px) {
          .perspective-container {
            perspective: none;
          }
        }
      `}</style>
    </motion.div>
  );
}