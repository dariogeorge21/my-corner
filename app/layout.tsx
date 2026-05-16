import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Fallback to Inter while Matter is not locally provided
import "./globals.css";

const matterFallback = Inter({ subsets: ["latin"], variable: "--font-matter" });

export const metadata: Metadata = {
  title: "Dario's Corner | Engineering & Design",
  description: "A professional yet personable domain landing page showcasing Dario's portfolio, expertise, and body of work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${matterFallback.variable} font-sans antialiased text-foreground bg-background`}>
        {children}
      </body>
    </html>
  );
}