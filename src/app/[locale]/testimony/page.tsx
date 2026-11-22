import { getTranslations, setRequestLocale } from "next-intl/server";
import TestimonyPageClient from "./TestimonyPageClient";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildPageMetadata({
    locale,
    path: "/testimony",
    title: t("testimonyTitle"),
    description: t("testimonyDescription"),
  });
}

export default function TestimonyPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return <TestimonyPageClient />;
}
