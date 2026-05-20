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
  return (
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
  );
}