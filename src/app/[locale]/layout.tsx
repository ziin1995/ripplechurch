import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundMusic from "@/components/BackgroundMusic";
import JsonLd from "@/components/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const keywords = t("keywords")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    ...buildPageMetadata({
      locale,
      path: "",
      title: t("siteTitle"),
      description: t("siteDescription"),
      keywords,
    }),
  };
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const tMeta = await getTranslations({ locale, namespace: "metadata" });

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Gowun+Batang:wght@400;700&family=Noto+Serif+JP:wght@400;600&display=swap"
        />
        <meta name="theme-color" content="#090a14" />
        <JsonLd locale={locale} description={tMeta("siteDescription")} />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VMXLFE1QNH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VMXLFE1QNH');
          `}
        </Script>
      </head>
      <body
        className="flex min-h-screen flex-col"
        style={{ fontFamily: "Pretendard, system-ui, sans-serif" }}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackgroundMusic />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
