import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Agbalumo,
  Funnel_Display,
  Lobster,
  Google_Sans_Flex,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import SplashCursor from "@/components/SplashCursor";
import { Analytics } from "@vercel/analytics/next";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
const agbalumo = Agbalumo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-agbalumo",
});
const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-funnel-display",
});
const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lobster",
});
const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-google-sans-flex",
});

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = "https://dariogeorge.in";
const SITE_NAME = "Dario George";

// ─── Root Metadata ────────────────────────────────────────────────────────────
/**
 * Primary keyword:    "Website Developer Delhi"
 * Related keywords:   "Website Developer Kerala", "Web App Developer India",
 *                     "Next.js Developer", "React Developer", "PC Repair Delhi"
 * Semantic keywords:  "custom website development", "scalable web applications",
 *                     "technical documentation", "hardware support",
 *                     "full-stack developer", "freelance web developer"
 *
 * Placement: title → primary + location; description → natural prose that
 * weaves in primary + semantic keywords without stuffing.
 */
export const metadata: Metadata = {
  // ── Title ──────────────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "Dario George | Website Developer in Kerala & Delhi – Web Apps, PC Repair",
    template: `%s | ${SITE_NAME}`,
  },

  // ── Description ────────────────────────────────────────────────────────────
  description:
    "Dario George is a freelance website developer based in Kerala and Delhi. I build custom websites, scalable Next.js web applications, and provide on-site PC hardware support across Delhi NCR. Serving clients pan-India.",

  // ── Keywords ───────────────────────────────────────────────────────────────
  // Primary: website developer Delhi | Related: Kerala, React, Next.js
  // Semantic: custom website, scalable web apps, technical documentation
  keywords: [
    // Primary
    "website developer Delhi",
    "web developer Delhi",
    // Related
    "website developer Kerala",
    "web app developer India",
    "Next.js developer India",
    "React developer freelance",
    "PC repair Delhi NCR",
    // Semantic
    "custom website development",
    "scalable web applications",
    "full-stack developer freelance",
    "technical documentation writer",
    "hardware support Delhi",
    "freelance web developer India",
    "SaaS developer",
    "Dario George developer",
  ],

  // ── Author & Creator ───────────────────────────────────────────────────────
  authors: [{ name: SITE_NAME, url: BASE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // ── Canonical & Alternates ─────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: SITE_NAME,
    title:
      "Dario George | Website Developer in Delhi & Kerala – Web Apps, PC Repair",
    description:
      "Freelance website developer in Delhi and Kerala. Custom websites, Next.js web applications, and PC hardware support. Serving clients pan-India.",
    images: [
      {
        url: `${BASE_URL}/web-app-manifest-512x512.png`,
        width: 512,
        height: 512,
        alt: "Dario George – Website Developer",
      },
    ],
  },

  // ── Twitter / X ────────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title:
      "Dario George | Website Developer in Kerala & Delhi – Web Apps, PC Repair",
    description:
      "Freelance website developer. Custom websites, Next.js web apps, PC hardware support. Based in Delhi & Kerala – serving India-wide.",
    images: [`${BASE_URL}/web-app-manifest-512x512.png`],
    creator: "@dariogeorge21",
  },

  // ── Robots ─────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Verification ───────────────────────────────────────────────────────────
  // Add your Google Search Console verification token here when available:
  // verification: { google: "YOUR_GOOGLE_VERIFICATION_TOKEN" },

  // ── Category ───────────────────────────────────────────────────────────────
  category: "technology",
};

// ─── Viewport ─────────────────────────────────────────────────────────────────
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

// ─── Structured Data (Schema.org) ─────────────────────────────────────────────
/**
 * Multi-type JSON-LD block combining:
 *  1. Person          – identifies Dario George as the creator/professional
 *  2. ProfessionalService – the freelance business entity with local SEO data
 *  3. WebSite         – enables Google Sitelinks Search Box
 *  4. BreadcrumbList  – top-level page sections as breadcrumbs
 *  5. ItemList        – featured projects for rich results
 */
function StructuredData() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: "Dario George",
    url: BASE_URL,
    jobTitle: "Website & Software Developer",
    description:
      "Freelance website developer specialising in custom websites, Next.js web applications, technical documentation, and PC hardware support.",
    image: `${BASE_URL}/web-app-manifest-512x512.png`,
    sameAs: [
      "https://linkedin.com/in/dariogeorge21",
      "https://github.com/dariogeorge21",
    ],
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "TypeScript",
      "Full-Stack Development",
      "PC Hardware",
      "Technical Documentation",
    ],
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Delhi",
        addressRegion: "Delhi",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Palai",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
    ],
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${BASE_URL}/#service`,
    name: "Dario George – Web & Software Development",
    description:
      "Custom website development, scalable Next.js web applications, technical documentation, and on-site PC hardware support across Delhi NCR and pan-India.",
    url: BASE_URL,
    founder: { "@id": `${BASE_URL}/#person` },
    areaServed: [
      { "@type": "City", name: "Delhi" },
      { "@type": "City", name: "Noida" },
      { "@type": "City", name: "Gurgaon" },
      { "@type": "State", name: "Kerala" },
      { "@type": "Country", name: "India" },
    ],
    serviceType: [
      "Website Development",
      "Web Application Development",
      "Technical Documentation",
      "PC Hardware Support",
      "PC Repair",
    ],
    priceRange: "$$",
    sameAs: [
      "https://linkedin.com/in/dariogeorge21",
      "https://github.com/dariogeorge21",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Website Development",
          description:
            "Custom websites and web applications built with Next.js, React, and modern tooling. Responsive, fast, and SEO-optimised.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Reports and Technical Documentation",
          description:
            "Professional technical reports, user manuals, SOPs, and project documentation delivered in structured, accessible formats.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "PC Hardware Support",
          description:
            "On-site PC building, upgrades, diagnostics, and repair services in Delhi NCR.",
          areaServed: { "@type": "City", name: "Delhi" },
        },
      },
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: SITE_NAME,
    url: BASE_URL,
    description:
      "Official website of Dario George – freelance website developer in Delhi and Kerala.",
    author: { "@id": `${BASE_URL}/#person` },
    inLanguage: "en-IN",
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${BASE_URL}/#services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Featured Work",
        item: `${BASE_URL}/#work`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Contact",
        item: `${BASE_URL}/#contact`,
      },
    ],
  };

  const projectList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured Projects by Dario George",
    description:
      "A curated list of web applications and software projects built by Dario George.",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "SoftwareApplication",
          name: "PlannerHQ",
          applicationCategory: "BusinessApplication",
          description:
            "All-in-one collaborative workspace with project management, rich-text docs, real-time sync, and AI writing assistant. Built with Next.js and Supabase.",
          url: "https://github.com/dariogeorge21/plannerhq",
          author: { "@id": `${BASE_URL}/#person` },
          programmingLanguage: ["TypeScript", "Next.js", "Supabase"],
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "SoftwareApplication",
          name: "Bus Pass Ticket Generator",
          applicationCategory: "WebApplication",
          description:
            "Bus pass management system for St. Joseph's College of Engineering and Technology, Palai. Features user authentication and Razorpay payments.",
          url: "https://buspass.sjcetpalai.ac.in",
          author: { "@id": `${BASE_URL}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "SoftwareApplication",
          name: "QR Code Generator",
          applicationCategory: "UtilitiesApplication",
          description:
            "Responsive QR code generator supporting text, URLs, and UPI payment QR codes with downloadable PNG/SVG output.",
          url: "https://qr.dariogeorge.in",
          author: { "@id": `${BASE_URL}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "WebSite",
          name: "St Mary's Computers",
          description:
            "SEO-focused local business website for a computer repair shop, featuring structured data, service pages, and mobile-first design.",
          url: "https://stmaryscomputers.in",
          author: { "@id": `${BASE_URL}/#person` },
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalService),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectList) }}
      />
    </>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${agbalumo.variable} ${funnelDisplay.variable} ${lobster.variable} ${googleSansFlex.variable}`}
    >
      <head>
        <Analytics />
        <meta name="apple-mobile-web-app-title" content="Dario" />
        {/* Geographic meta tags for local SEO */}
        <meta name="geo.region" content="IN-DL" />
        <meta name="geo.placename" content="Delhi, India" />
        <meta name="geo.region" content="IN-KL" />
        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <StructuredData />
      </head>
      <body className="font-sans min-h-screen relative overflow-x-hidden">
        <SplashCursor />
        <div className="ambient-glow" />
        <Providers attribute="class" enableSystem disableTransitionOnChange>
          <Header />
          <main id="main-content" className="relative z-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}