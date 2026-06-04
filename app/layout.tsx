import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Agbalumo, Funnel_Display, Lobster, Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SplashCursor from "@/components/SplashCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const agbalumo = Agbalumo({ subsets: ["latin"], weight: "400", variable: "--font-agbalumo" });
const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-funnel-display" });
const lobster = Lobster({ subsets: ["latin"], weight: "400", variable: "--font-lobster" });
const googleSansFlex = Google_Sans_Flex({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-google-sans-flex" });

export const metadata: Metadata = {
  title: "Dario George | Website & Software Developer in Delhi & Kerala",
  description: "Dario George offers custom website development, scalable web apps, and expert PC hardware support for small businesses. Operating in Delhi and Kerala, serving India-wide.",
  keywords: ["Website Developer Delhi", "Software Developer Kerala", "PC Repair Delhi", "Custom Web Apps India", "React Developer", "Next.js Expert"],
  alternates: {
    canonical: "https://dariogeorge.in",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // JSON-LD Structured Data for Local/Professional Service SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Dario George",
    "description": "Premium Website Development, Web Apps, and Hardware Support services.",
    "areaServed": [
      { "@type": "City", "name": "Delhi" },
      { "@type": "State", "name": "Kerala" },
      { "@type": "Country", "name": "India" }
    ],
    "url": "https://dariogeorge.in",
    "sameAs": [
      "https://linkedin.com/in/dariogeorge21",
      "https://github.com/dariogeorge21"
    ],
    "makesOffer": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hardware Support & Repair" } }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${agbalumo.variable} ${funnelDisplay.variable} ${lobster.variable} ${googleSansFlex.variable}`}>
      <head>
      <meta name="apple-mobile-web-app-title" content="Dario" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans min-h-screen relative overflow-x-hidden">
        <SplashCursor />
        <div className="ambient-glow" />
        <Providers attribute="class" enableSystem disableTransitionOnChange>
          <Header />
          <main className="relative z-10">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}