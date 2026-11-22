import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import RoseWindow from "@/components/RoseWindow";
import LancetWindow from "@/components/LancetWindow";
import { getWeeklyWaveContent } from "@/lib/supabase";
import { listWeeklyWaves } from "@/lib/weeklyWaveStore";
import { getMemberCount } from "@/lib/memberStore";
import MemberCount from "@/components/MemberCount";
import { getPlainPreview } from "@/lib/richTextUtils";
import { getDateLocale } from "@/lib/dateLocale";

type Props = {
  params: { locale: string };
};

export const revalidate = 60;

const RAYS = [
  { angle: -24, color: "rgba(44,95,217,0.7)", width: 130 },
  { angle: -13, color: "rgba(196,36,63,0.65)", width: 90 },
  { angle: -4, color: "rgba(255,226,154,0.6)", width: 150 },
  { angle: 6, color: "rgba(58,160,232,0.45)", width: 100 },
  { angle: 15, color: "rgba(124,63,191,0.5)", width: 120 },
  { angle: 25, color: "rgba(234,165,58,0.45)", width: 90 },
];

const LANCETS = [
  {
    href: "/scripture" as const,
    navKey: "scripture" as const,
    symbol: "book" as const,
    base: "#2c5fd9",
    deep: "#0b1a52",
    medal: "#eaa53a",
    glow: "rgba(44,95,217,0.6)",
  },
  {
    href: "/weekly" as const,
    navKey: "weekly" as const,
    symbol: "wave" as const,
    base: "#c4243f",
    deep: "#4a0816",
    medal: "#ffe29a",
    glow: "rgba(196,36,63,0.6)",
  },
  {
    href: "/testimony" as const,
    navKey: "testimony" as const,
    symbol: "voice" as const,
    base: "#1c9c6c",
    deep: "#05352a",
    medal: "#c9a0ff",
    glow: "rgba(28,156,108,0.6)",
  },
];

export default async function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tWeekly = await getTranslations("weekly");
  const tNav = await getTranslations("nav");
  const tLogo = await getTranslations("logo");
  const tTestimony = await getTranslations("testimony");

  let latest;
  try {
    const result = await listWeeklyWaves();
    latest = result.waves[0];
  } catch {
    latest = undefined;
  }

  const latestContent = latest ? getWeeklyWaveContent(latest, locale) : null;

  let memberCount = 0;
  try {
    const result = await getMemberCount();
    memberCount = result.count;
  } catch {
    memberCount = 0;
  }

  const lancetCaptions: Record<(typeof LANCETS)[number]["navKey"], string> = {
    scripture: tLogo("subtitle"),
    weekly: tWeekly("subtitle"),
    testimony: tTestimony("subtitle"),
  };

  return (
    <>
      {/* ── 장미창 히어로 ── */}
      <section className="relative isolate overflow-hidden">
        <div className="light-rays" aria-hidden="true">
          {RAYS.map((ray) => (
            <span
              key={ray.angle}
              style={{
                width: ray.width,
                marginLeft: -ray.width / 2,
                transform: `rotate(${ray.angle}deg)`,
                background: `linear-gradient(180deg, ${ray.color}, transparent 85%)`,
                animationDelay: `${(ray.angle + 30) / 12}s`,
              }}
            />
          ))}
        </div>
        <div className="dust" aria-hidden="true" />

        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-10 text-center md:pb-24 md:pt-14">
          <div className="animate-fade-in relative w-full max-w-[460px]">
            <div
              className="absolute inset-[6%] -z-10 rounded-full blur-3xl"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(196,36,63,.55), rgba(44,95,217,.55), rgba(28,156,108,.45), rgba(234,165,58,.5), rgba(124,63,191,.5), rgba(196,36,63,.55))",
              }}
              aria-hidden="true"
            />
            <RoseWindow className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]" />
          </div>

          <p className="mt-10 font-display text-xs uppercase tracking-[0.5em] text-accent/80">
            Ripple Church
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">{t("headline")}</h1>
          <div className="ornament mt-5" aria-hidden="true">
            <span className="text-lg">✦</span>
          </div>
          <p className="mt-4 font-serif text-lg text-foreground/85 md:text-xl">{t("subheadline")}</p>
          <MemberCount count={memberCount} className="mt-3" />

          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link href="/scripture" className="btn-gold">
              {t("readScripture")}
            </Link>
            <Link href="/weekly" className="btn-ghost">
              {t("readWeekly")}
            </Link>
            <Link href="/join" className="btn-ghost">
              {t("join")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 세 개의 첨두아치 창 ── */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12">
          {LANCETS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex flex-col items-center text-center"
            >
              <span
                className="lancet w-full max-w-[190px]"
                style={{ ["--lancet-glow" as string]: l.glow }}
              >
                <LancetWindow
                  id={`lancet-${l.navKey}`}
                  base={l.base}
                  deep={l.deep}
                  medal={l.medal}
                  symbol={l.symbol}
                />
              </span>
              <span className="mt-5 font-display text-base font-semibold text-foreground transition-colors group-hover:text-accent sm:text-lg">
                {tNav(l.navKey)}
              </span>
              <span className="mt-1 hidden text-xs leading-relaxed text-muted sm:block">
                {lancetCaptions[l.navKey]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 최신 주간 파동 ── */}
      {latest && latestContent && (
        <section className="mx-auto max-w-3xl px-4 pb-24">
          <div className="glass-panel-banded p-7 text-left md:p-9">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-medium text-accent">
                {tWeekly("sender")}
              </span>
              <span className="text-muted">
                {new Date(latest.published_at).toLocaleDateString(getDateLocale(locale), {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h2 className="mb-3 text-xl font-semibold text-foreground md:text-2xl">
              {latestContent.title}
            </h2>
            <p className="line-clamp-3 font-serif text-[15px] leading-relaxed text-foreground/75">
              {getPlainPreview(latestContent.content)}
            </p>
            <Link
              href={`/weekly/${latest.slug}`}
              className="mt-5 inline-block text-sm font-medium text-accent hover:opacity-80"
            >
              {tWeekly("readMore")} →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
