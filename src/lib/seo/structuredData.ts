import { DEXISPHERE_SITE_URL, dexisphereSiteLink } from "@/lib/config";
import { PLANS } from "@/data/plans";
import { SITE } from "./site";

/**
 * JSON-LD for the app. The organisation is the same entity dexisphere.com
 * describes, so it shares that site's `@id`; prices come from `PLANS`, which
 * is transcribed from its pricing page (USD, one-time).
 */
export function structuredData() {
  const organization = `${DEXISPHERE_SITE_URL}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organization,
        name: SITE.shortName,
        url: DEXISPHERE_SITE_URL,
        logo: `${SITE.url}/image/dexisphere-icon512.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: SITE.name,
        url: SITE.url,
        inLanguage: "en",
        publisher: { "@id": organization },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        publisher: { "@id": organization },
        offers: PLANS.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          price: plan.price,
          priceCurrency: "USD",
          url: dexisphereSiteLink("/pricing"),
        })),
      },
    ],
  };
}
