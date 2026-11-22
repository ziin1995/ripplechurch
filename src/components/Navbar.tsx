"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems = [
  { href: "/scripture" as const, key: "scripture" as const },
  { href: "/weekly" as const, key: "weekly" as const },
  { href: "/testimony" as const, key: "testimony" as const },
  { href: "/join" as const, key: "join" as const },
  { href: "/about" as const, key: "about" as const },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-accent/15 bg-background/75 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <NavMark />
          <span className="hidden font-display text-sm font-semibold tracking-[0.25em] text-foreground sm:inline">
            RIPPLE CHURCH
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive =
                item.href === "/weekly"
                  ? pathname === "/weekly" || pathname.startsWith("/weekly/")
                  : pathname === item.href;

              return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative py-1 text-sm transition-colors hover:text-accent ${
                    isActive
                      ? "font-medium text-accent after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-accent after:to-transparent"
                      : "text-foreground/70"
                  }`}
                >
                  {t(item.key)}
                </Link>
              </li>
              );
            })}
          </ul>
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher compact />
          <button
            type="button"
            className="flex flex-col gap-1.5 p-2"
            aria-label={t("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span
              className={`block h-0.5 w-6 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>
      <div className="mosaic-strip opacity-80" aria-hidden="true" />

      {open && (
        <div className="border-t border-accent/15 bg-background/95 px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive =
                item.href === "/weekly"
                  ? pathname === "/weekly" || pathname.startsWith("/weekly/")
                  : pathname === item.href;

              return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block text-base ${
                    isActive ? "font-medium text-accent" : "text-foreground/70"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}

function NavMark() {
  return (
    <svg viewBox="-40 -40 80 80" className="h-9 w-9 drop-shadow-[0_0_10px_rgba(226,187,98,0.35)]" aria-hidden="true">
      <defs>
        <radialGradient id="navmark-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6dc" />
          <stop offset="45%" stopColor="#e2bb62" />
          <stop offset="100%" stopColor="#2c5fd9" />
        </radialGradient>
      </defs>
      <circle r="38" fill="#120d08" stroke="#e2bb62" strokeOpacity="0.7" strokeWidth="1.5" />
      {["#c4243f", "#2c5fd9", "#eaa53a", "#1c9c6c", "#7c3fbf", "#3aa0e8", "#c4243f", "#eaa53a"].map((c, i) => {
        const a0 = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const a1 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2;
        const pt = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
        return (
          <path
            key={i}
            d={`M${pt(20, a0)} L${pt(34, a0)} A34 34 0 0 1 ${pt(34, a1)} L${pt(20, a1)} A20 20 0 0 0 ${pt(20, a0)}Z`}
            fill={c}
            stroke="#120d08"
            strokeWidth="2.5"
          />
        );
      })}
      <circle r="20" fill="url(#navmark-core)" stroke="#120d08" strokeWidth="2.5" />
      <circle r="13" fill="none" stroke="#120d08" strokeWidth="1.2" strokeOpacity="0.7" />
      <circle cx="0" cy="-6" r="3.6" fill="#120d08" />
      <path d="M-5.6 -0.4 Q-6.8 6.4 -6 11 L6 11 Q6.8 6.4 5.6 -0.4 Q2.4 -2.4 0 -2.4 Q-2.4 -2.4 -5.6 -0.4Z" fill="#120d08" />
    </svg>
  );
}
