import { getTranslations, setRequestLocale } from "next-intl/server";
import WeeklyWavePageClient from "./WeeklyWavePageClient";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildPageMetadata({
    locale,
    path: "/weekly",
    title: t("weeklyTitle"),
    description: t("weeklyDescription"),
  });
}

export default function WeeklyWavePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return <WeeklyWavePageClient />;
}
