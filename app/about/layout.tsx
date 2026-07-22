import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Dario George | Full-Stack Web Developer from Kerala, India",
  description:
    "Learn about Dario George — a full-stack web developer from Kerala, India specialising in Next.js, React, TypeScript, Supabase, AI-powered applications, and scalable SaaS products. Read his story, philosophy, and technical expertise.",
  alternates: {
    canonical: "https://dariogeorge.in/about",
  },
  keywords: [
    "Dario George developer",
    "full-stack developer Kerala",
    "Next.js developer India",
    "React developer Kerala",
    "about Dario George",
    "web developer portfolio",
    "AI application developer India",
    "TypeScript developer",
    "Supabase developer",
    "freelance developer India",
  ],
  openGraph: {
    title: "About Dario George | Full-Stack Web Developer from Kerala",
    description:
      "Full-stack developer from Kerala, India. Building modern web applications, AI-powered products, and scalable SaaS solutions with Next.js, React, and TypeScript.",
    url: "https://dariogeorge.in/about",
    type: "website",
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
