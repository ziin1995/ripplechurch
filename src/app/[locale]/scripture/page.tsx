import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: { locale: string } };

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

// 계명마다 다른 색유리
const GLASS = [
  { hi: "#ff6f7f", mid: "#c4243f", lo: "#5e0c1d", glow: "rgba(196,36,63,.55)" },
  { hi: "#7fa6ff", mid: "#2c5fd9", lo: "#0e2266", glow: "rgba(44,95,217,.55)" },
  { hi: "#ffe29a", mid: "#eaa53a", lo: "#7a4708", glow: "rgba(234,165,58,.55)" },
  { hi: "#7be3b3", mid: "#1c9c6c", lo: "#06422c", glow: "rgba(28,156,108,.55)" },
  { hi: "#c9a0ff", mid: "#7c3fbf", lo: "#311059", glow: "rgba(124,63,191,.55)" },
  { hi: "#a6e0ff", mid: "#3aa0e8", lo: "#0f4c80", glow: "rgba(58,160,232,.55)" },
];

async function getScriptureContent(locale: string) {
  const messages = (await import(`../../../../messages/${locale}.json`)).default;
  return {
    commandments: messages.commandments as string[],
    pdfPath: messages.scripture.pdfPath as string,
  };
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildPageMetadata({
    locale,
    path: "/scripture",
    title: t("scriptureTitle"),
    description: t("scriptureDescription"),
  });
}

export default async function ScripturePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("scripture");
  const { commandments, pdfPath } = await getScriptureContent(locale);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 md:py-20">
      <header className="mb-14 text-center">
        <p className="font-display text-xs uppercase tracking-[0.5em] text-accent/80">
          {t("subtitle")}
        </p>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">{t("title")}</h1>
        <div className="ornament mt-6" aria-hidden="true">
          <span>✦</span>
        </div>
      </header>

      <ol className="space-y-6">
        {commandments.map((text, index) => {
          const glass = GLASS[index % GLASS.length];
          return (
            <li key={index}>
              <article className="glass-panel group flex items-center gap-5 p-5 transition-colors hover:border-accent/50 md:gap-7 md:p-7">
                <div
                  className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full md:h-20 md:w-20"
                  style={{
                    background: `radial-gradient(circle at 50% 40%, #fffaf0 0%, ${glass.hi} 18%, ${glass.mid} 58%, ${glass.lo} 100%)`,
                    boxShadow: `0 0 0 3px #120d08, 0 0 0 4px rgba(226,187,98,.55), 0 0 32px -2px ${glass.glow}`,
                  }}
                  aria-hidden="true"
                >
                  <span
                    className="absolute inset-[18%] rounded-full"
                    style={{ boxShadow: "inset 0 0 0 2px rgba(18,13,8,.75)" }}
                  />
                  <span className="relative font-display text-xl font-bold text-[#120d08] md:text-2xl">
                    {ROMAN[index] ?? index + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent/80">
                    {t("commandmentLabel", { number: index + 1 })}
                  </p>
                  <p className="mt-2 font-serif text-lg leading-relaxed text-foreground md:text-xl">
                    {text}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <div className="mt-14 text-center">
        <a href={pdfPath} target="_blank" rel="noopener noreferrer" className="btn-gold">
          {t("downloadPdf")}
        </a>
      </div>
    </section>
  );
}
