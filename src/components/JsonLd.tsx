import { SITE_NAME, SITE_URL } from "@/lib/seo";

type Props = {
  locale: string;
  description: string;
};

export default function JsonLd({ locale, description }: Props) {
  const inLanguage =
    locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";

  const organization = {
    "@context": "https://schema.org",
    "@type": "ReligiousOrganization",
    name: SITE_NAME,
    alternateName: ["리플교회", "リップルチャーチ", "Book of Waves"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description,
    foundingDate: "2026",
    inLanguage: ["ko-KR", "en-US", "ja-JP"],
    knowsAbout: [
      "waves",
      "spirituality",
      "new religious movement",
      "online community",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["ko-KR", "en-US", "ja-JP"],
    description,
    publisher: {
      "@type": "ReligiousOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const aboutPage = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `${SITE_NAME} About`,
    url: `${SITE_URL}/${locale}/about`,
    inLanguage,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPage) }}
      />
    </>
  );
}
