import type { Metadata } from "next";
import { profile } from "@/config/profile";
import { Hero } from "@/components/home/Hero";
import { DomainsGrid } from "@/components/home/DomainsGrid";
import { FeaturedTools } from "@/components/home/FeaturedTools";
import { ScienceMeetsCode } from "@/components/home/ScienceMeetsCode";
import { CTABanner } from "@/components/home/CTABanner";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chem-portfolio.vercel.app";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  jobTitle: profile.role,
  email: profile.email,
  sameAs: [profile.github, profile.linkedin].filter(Boolean),
  knowsAbout: profile.focusAreas,
  description: profile.tagline,
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${profile.name}.lab`,
  url: siteUrl,
  description: profile.tagline,
  inLanguage: "en",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <Hero />
      <DomainsGrid />
      <FeaturedTools />
      <ScienceMeetsCode />
      <CTABanner />
    </>
  );
}
