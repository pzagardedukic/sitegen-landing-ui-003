import { getSeoOrganization } from "@/core/seo";
import { SITE_URL } from "@/core/seo";

export default function OrganizationJsonLd() {
  const org = getSeoOrganization();

  const email = org.contacts.find((c) => c.type === "EMAIL")?.value;
  const phone = org.contacts.find((c) => c.type === "PHONE")?.value;
  const sameAs = org.contacts
    .filter((c) =>
      [
        "LINKEDIN",
        "INSTAGRAM",
        "FACEBOOK",
        "TWITTER",
        "TIKTOK",
        "WEBSITE",
      ].includes(c.type),
    )
    .map((c) => c.value);

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    ...(SITE_URL ? { url: SITE_URL } : {}),
    ...(org.logo ? { logo: org.logo } : {}),
    ...(org.slogan ? { description: org.slogan } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(org.company?.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: org.company.address,
            postalCode: org.company.postalCode,
            addressLocality: org.company.postalOffice,
            addressCountry: org.company.country,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
