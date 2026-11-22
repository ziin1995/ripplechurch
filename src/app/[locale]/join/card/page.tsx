import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import JoinCardViewerClient from "./JoinCardViewerClient";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildPageMetadata({
    locale,
    path: "/join/card",
    title: t("joinCardTitle"),
    description: t("joinCardDescription"),
    noIndex: true,
  });
}

export default function JoinCardPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return (
    <Suspense>
      <JoinCardViewerClient />
    </Suspense>
  );
}
