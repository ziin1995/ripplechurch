import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { absoluteUrl, languageAlternates, PUBLIC_PATHS, SITE_URL } from "@/lib/seo";
import { listWeeklyWaves } from "@/lib/weeklyWaveStore";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PUBLIC_PATHS) {
    const languages = languageAlternates(path);
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: now,
        changeFrequency: path === "" || path === "/weekly" ? "daily" : "weekly",
        priority: path === "" ? 1 : path === "/about" || path === "/join" ? 0.9 : 0.7,
        alternates: { languages },
      });
    }
  }

  try {
    const { waves } = await listWeeklyWaves();
    for (const wave of waves) {
      const path = `/weekly/${wave.slug}`;
      const languages = languageAlternates(path);
      const lastModified = new Date(wave.published_at);
      for (const locale of routing.locales) {
        entries.push({
          url: absoluteUrl(locale, path),
          lastModified,
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: { languages },
        });
      }
    }
  } catch {
    // Sitemap still useful without weekly entries.
  }

  entries.push({
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1,
  });

  return entries;
}
