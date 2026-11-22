import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: { locale: string } };

async function getCommandments(locale: string) {
  const messages = (await import(`../../../../messages/${locale}.json`)).default;
  return messages.commandments as string[];
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("aboutTitle") };
}

export default async function AboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const commandments = await getCommandments(locale);

  const sections = [
    { title: t("whatWeAreTitle"), body: t("whatWeAreBody"), color: "#c4243f" },
    { title: t("whatIsWaveTitle"), body: t("whatIsWaveBody"), color: "#2c5fd9" },
    { title: t("whyNowTitle"), body: t("whyNowBody"), color: "#1c9c6c" },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 md:py-20">
      <header className="mb-14 text-center">
        <p className="font-display text-xs uppercase tracking-[0.5em] text-accent/80">
          Ripple Church
        </p>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">{t("title")}</h1>
        <div className="ornament mt-6" aria-hidden="true">
          <span>✦</span>
        </div>
      </header>

      <div className="space-y-6">
        {sections.map((s) => (
          <article key={s.title} className="glass-panel p-7 md:p-9">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-accent md:text-2xl">
              <Diamond color={s.color} />
              {s.title}
            </h2>
            <p className="mt-4 font-serif leading-loose text-foreground/80">{s.body}</p>
          </article>
        ))}

        <article className="glass-panel-banded p-7 md:p-9">
          <h2 className="flex items-center gap-3 text-xl font-semibold text-accent md:text-2xl">
            <Diamond color="#eaa53a" />
            {t("ourFaithTitle")}
          </h2>
          <ul className="mt-5 space-y-3">
            {commandments.map((text, index) => (
              <li key={index} className="flex gap-3 font-serif leading-relaxed text-foreground/80">
                <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent/70" />
                <span>{t("commandmentItem", { number: index + 1, text })}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function Diamond({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3.5 w-3.5 shrink-0 rotate-45"
      style={{
        background: `radial-gradient(circle at 40% 35%, #fff 0%, ${color} 45%, #120d08 120%)`,
        boxShadow: `0 0 0 2px #120d08, 0 0 0 3px rgba(226,187,98,.5), 0 0 14px ${color}`,
      }}
    />
  );
}
