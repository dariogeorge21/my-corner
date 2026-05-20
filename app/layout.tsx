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
  title: "Dario's Corner | Web Developer & Software Architect",
  description: "I'm Dario, a web developer specializing in crafting scalable, performant web applications. Mastering in web design, development, and architecture, I create seamless user experiences. With a passion for innovation and a commitment to excellence, I bring ideas to life through code. Explore my portfolio and let's build something amazing together.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${agbalumo.variable} ${funnelDisplay.variable} ${lobster.variable} ${googleSansFlex.variable}`}>
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