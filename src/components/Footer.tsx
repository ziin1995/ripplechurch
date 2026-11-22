"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="relative mt-auto">
      <div className="mosaic-strip opacity-70" aria-hidden="true" />
      <div className="border-t border-accent/10 bg-black/30 py-10 text-center">
        <p className="font-display text-xs uppercase tracking-[0.45em] text-accent/70">
          Ripple Church
        </p>
        <div className="ornament my-4" aria-hidden="true">
          <span>✦</span>
        </div>
        <p className="text-sm text-muted">{t("tagline")}</p>
      </div>
    </footer>
  );
}
