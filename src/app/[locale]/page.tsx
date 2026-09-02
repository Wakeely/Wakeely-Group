import { HomeClient } from "@/components/home-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://group.legalwakeely.com";

export default function HomePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wakeely Group",
    url: SITE_URL,
    description:
      "A digital legal ecosystem connecting knowledge, procedures, matter management, and tools for lawyers in Jordan.",
    areaServed: "Jordan",
    brand: "Wakeely",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Wakeely Group",
    url: SITE_URL,
    inLanguage: ["ar", "en"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }}
      />
      <HomeClient />
    </>
  );
}
