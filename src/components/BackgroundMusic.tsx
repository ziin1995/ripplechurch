"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const SRC = "/audio/bgm.mp3";
const TARGET_VOLUME = 0.35;
const PREF_KEY = "rc-bgm"; // "on" | "off" — 사용자가 끈 경우 다시 켜지지 않게
const TIME_KEY = "rc-bgm-time"; // 언어 전환 등으로 다시 마운트돼도 이어서 재생

function readPref(): string | null {
  try {
    return localStorage.getItem(PREF_KEY);
  } catch {
    return null;
  }
}

function writePref(value: "on" | "off") {
  try {
    localStorage.setItem(PREF_KEY, value);
  } catch {
    /* noop */
  }
}

export default function BackgroundMusic() {
  const t = useTranslations("music");
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const fadeTo = useCallback((target: number, ms: number, done?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      audio.volume = from + (target - from) * k;
      if (k < 1) {
        fadeRef.current = requestAnimationFrame(tick);
      } else {
        fadeRef.current = null;
        done?.();
      }
    };
    fadeRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    audio.volume = 0;
    try {
      await audio.play();
      fadeTo(TARGET_VOLUME, 2500);
      return true;
    } catch {
      return false;
    }
  }, [fadeTo]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeTo(0, 600, () => audio.pause());
  }, [fadeTo]);

  // 첫 진입: 자동재생 시도 → 막히면 첫 클릭/키 입력 때 시작
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      const saved = Number(sessionStorage.getItem(TIME_KEY));
      if (saved > 0) audio.currentTime = saved;
    } catch {
      /* noop */
    }

    if (readPref() === "off") return;

    let unlocked = false;
    const unlock = (e: Event) => {
      if ((e.target as HTMLElement | null)?.closest?.("[data-bgm-toggle]")) return;
      if (unlocked || readPref() === "off" || !audio.paused) return cleanup();
      unlocked = true;
      cleanup();
      start();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };

    start().then((ok) => {
      if (!ok) {
        window.addEventListener("pointerdown", unlock);
        window.addEventListener("keydown", unlock);
      }
    });

    const saveTime = () => {
      try {
        sessionStorage.setItem(TIME_KEY, String(audio.currentTime));
      } catch {
        /* noop */
      }
    };
    window.addEventListener("pagehide", saveTime);

    return () => {
      cleanup();
      saveTime();
      window.removeEventListener("pagehide", saveTime);
    };
  }, [start]);

  const toggle = async () => {
    if (playing) {
      writePref("off");
      stop();
    } else {
      writePref("on");
      await start();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        data-bgm-toggle
        onClick={toggle}
        aria-label={playing ? t("pause") : t("play")}
        aria-pressed={playing}
        title={playing ? t("pause") : t("play")}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-background/80 text-accent shadow-[0_10px_30px_-6px_rgba(0,0,0,0.8),0_0_24px_-6px_rgba(226,187,98,0.45)] backdrop-blur-md transition-all hover:border-accent hover:text-[#fff3d6] md:bottom-7 md:right-7"
      >
        {playing ? (
          <span className="bgm-bars flex h-4 items-end gap-[3px]" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M9 18V5l11-2v13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="17.5" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </button>
    </>
  );
}
