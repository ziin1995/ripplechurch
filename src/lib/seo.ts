import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL = "https://ripplechurch.net";
export const SITE_NAME = "Ripple Church";

export const PUBLIC_PATHS = [
  "",
  "/about",
  "/scripture",
  "/join",
  "/testimony",
  "/weekly",
] as const;

export function localePath(locale: string, path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/${locale}${normalized}`;
}

export function absoluteUrl(locale: string, path = ""): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

export function languageAlternates(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return languages;
}

type PageMetaInput = {
  locale: string;
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  keywords,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(locale, path);

  return {
    title,
    description,
    keywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Religion",
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function isLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale);
}
