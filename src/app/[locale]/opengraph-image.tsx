import { ImageResponse } from "next/og";
import { routing, type Locale } from "@/i18n/routing";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const COPY: Record<Locale, { title: string; subtitle: string }> = {
  ko: {
    title: "Ripple Church",
    subtitle: "파동의 새로운 종교 · 선한 파동을 만들어라",
  },
  en: {
    title: "Ripple Church",
    subtitle: "A new religion of waves · Make good waves",
  },
  ja: {
    title: "Ripple Church",
    subtitle: "波動の新しい宗教 · 良い波動を作れ",
  },
};

export default async function Image({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const copy = COPY[(locale as Locale) in COPY ? (locale as Locale) : "en"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "radial-gradient(circle at 50% 20%, #2c5fd9 0%, #090a14 55%, #05060c 100%)",
          color: "#ffe29a",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 180,
            height: 180,
            borderRadius: 999,
            border: "6px solid rgba(234,165,58,0.85)",
            alignItems: "center",
            justifyContent: "center",
            background:
              "conic-gradient(from 0deg, #c4243f, #2c5fd9, #1c9c6c, #eaa53a, #c4243f)",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              background: "#090a14",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
            }}
          >
            ✦
          </div>
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: 2 }}>
          {copy.title}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 28,
            color: "rgba(255,255,255,0.82)",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {copy.subtitle}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            color: "rgba(234,165,58,0.9)",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          ripplechurch.net
        </div>
      </div>
    ),
    { ...size }
  );
}
