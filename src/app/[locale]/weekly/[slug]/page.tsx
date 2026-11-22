import { getTranslations, setRequestLocale } from "next-intl/server";
import WeeklyWaveDetailClient from "./WeeklyWaveDetailClient";
import { getWeeklyWaveContent } from "@/lib/supabase";
import { getWeeklyWaveBySlug } from "@/lib/weeklyWaveStore";
import { buildPageMetadata } from "@/lib/seo";
import { getPlainPreview } from "@/lib/richTextUtils";

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params: { locale, slug } }: Props) {
  const t = await getTranslations({ locale, namespace: "metadata" });

  try {
    const { wave } = await getWeeklyWaveBySlug(slug);
    if (wave) {
      const { title, content } = getWeeklyWaveContent(wave, locale);
      const preview = getPlainPreview(content).slice(0, 155);
      return buildPageMetadata({
        locale,
        path: `/weekly/${slug}`,
        title: `${title} — Ripple Church`,
        description: preview || t("weeklyDescription"),
      });
    }
  } catch {
    // fall through
  }

  return buildPageMetadata({
    locale,
    path: `/weekly/${slug}`,
    title: `${slug} — ${t("weeklyTitle")}`,
    description: t("weeklyDescription"),
  });
}

export default function WeeklyWaveDetailPage({ params: { locale, slug } }: Props) {
  setRequestLocale(locale);
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <WeeklyWaveDetailClient slug={slug} />
    </section>
  );
}
