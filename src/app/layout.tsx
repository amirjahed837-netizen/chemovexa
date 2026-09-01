import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { profile } from "@/config/profile";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chemovexa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · CHEMOVEXA`,
    template: `%s · ${profile.name}`,
  },
  description: profile.tagline,
  applicationName: "CHEMOVEXA",
  keywords: [
    "chemistry",
    "organic chemistry",
    "physical chemistry",
    "programming",
    "cheminformatics",
    "RDKit",
    "3Dmol.js",
    "Next.js",
    "TypeScript",
    "portfolio",
    "computational chemistry",
    "AI",
    "RAG",
    "research",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "CHEMOVEXA",
    title: `${profile.name} · CHEMOVEXA — Chemistry meets Code`,
    description: profile.tagline,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${profile.name} · CHEMOVEXA — Chemistry meets Code`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · CHEMOVEXA — Chemistry meets Code`,
    description: profile.tagline,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
  category: "science",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#04070f" },
    { media: "(prefers-color-scheme: light)", color: "#04070f" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-ink-950 font-sans text-slate-200">
        <SkipToContent />
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
