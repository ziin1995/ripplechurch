import { getTranslations, setRequestLocale } from "next-intl/server";
import WeeklyComposeClient from "./WeeklyComposeClient";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildPageMetadata({
    locale,
    path: "/weekly/compose",
    title: t("weeklyComposeTitle"),
    description: t("weeklyDescription"),
    noIndex: true,
  });
}

export default function WeeklyComposePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return <WeeklyComposeClient />;
}
