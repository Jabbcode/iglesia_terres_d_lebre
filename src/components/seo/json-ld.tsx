import { IGLESIA_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constant";

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}

interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "Church";
  name: string;
  url: string;
  logo: string;
  description: string;
  image: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}

const organizationSchema: OrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: IGLESIA_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
};

const localBusinessSchema: LocalBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: IGLESIA_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/og-image.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Terres de l'Ebre",
    addressLocality: "Tortosa",
    addressRegion: "Tarragona",
    postalCode: "43500",
    addressCountry: "ES",
  },
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
    </>
  );
}
