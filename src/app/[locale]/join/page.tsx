import { getTranslations, setRequestLocale } from "next-intl/server";
import JoinPageClient from "./JoinPageClient";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildPageMetadata({
    locale,
    path: "/join",
    title: t("joinTitle"),
    description: t("joinDescription"),
  });
}

export default function JoinPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return <JoinPageClient />;
}
