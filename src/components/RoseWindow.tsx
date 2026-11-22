/**
 * 장미창(Rose Window) — Ripple Church의 동심원 파동 로고를 스테인드글라스로 옮긴 것.
 * 중앙 메달리온 = 파동을 방출하는 사람, 바깥 고리들 = 퍼져나가는 파동.
 */

type Props = {
  className?: string;
};

const LEAD = "#120d08";
const TAU = Math.PI * 2;

const GLASS: Record<string, [string, string, string]> = {
  // [중심(빛), 본색, 가장자리(그늘)]
  ruby: ["#ff6f7f", "#c4243f", "#5e0c1d"],
  cobalt: ["#7fa6ff", "#2c5fd9", "#0e2266"],
  azure: ["#a6e0ff", "#3aa0e8", "#0f4c80"],
  emerald: ["#7be3b3", "#1c9c6c", "#06422c"],
  amber: ["#ffe29a", "#eaa53a", "#7a4708"],
  violet: ["#c9a0ff", "#7c3fbf", "#311059"],
  night: ["#3a4fa0", "#16205a", "#070b26"],
  pale: ["#fffaf0", "#ffe9b8", "#e2bb62"],
};

const p = (r: number, a: number) => {
  const x = r * Math.cos(a - Math.PI / 2);
  const y = r * Math.sin(a - Math.PI / 2);
  return `${x.toFixed(2)} ${y.toFixed(2)}`;
};

/** r1~r2 사이 고리를 a0~a1 각도로 자른 조각 */
const sector = (r1: number, r2: number, a0: number, a1: number) =>
  `M${p(r1, a0)} L${p(r2, a0)} A${r2} ${r2} 0 0 1 ${p(r2, a1)} L${p(r1, a1)} A${r1} ${r1} 0 0 0 ${p(r1, a0)}Z`;

/** 첨두아치 꽃잎: 아래는 좁고 위는 뾰족 */
const petal = (r1: number, r2: number, a: number, w: number) => {
  const rs = r1 + (r2 - r1) * 0.55;
  return [
    `M${p(r1, a - w * 0.45)}`,
    `L${p(rs, a - w)}`,
    `Q${p(r2 - 6, a - w * 0.95)} ${p(r2, a)}`,
    `Q${p(r2 - 6, a + w * 0.95)} ${p(rs, a + w)}`,
    `L${p(r1, a + w * 0.45)}`,
    `A${r1} ${r1} 0 0 0 ${p(r1, a - w * 0.45)}Z`,
  ].join(" ");
};

const circleAt = (r: number, a: number) => {
  const x = r * Math.cos(a - Math.PI / 2);
  const y = r * Math.sin(a - Math.PI / 2);
  return { cx: +x.toFixed(2), cy: +y.toFixed(2) };
};

export default function RoseWindow({ className = "" }: Props) {
  const PETALS = 12;
  const step = TAU / PETALS;
  const petalColors = ["ruby", "cobalt", "ruby", "azure", "ruby", "cobalt"];
  const oculusColors = ["amber", "emerald", "amber", "violet"];
  const innerColors = ["emerald", "violet", "amber"];
  const roundelColors = ["amber", "ruby", "emerald", "cobalt", "violet", "amber", "azure", "ruby"];

  let paneIndex = 0;
  const delay = () => `${((paneIndex++ * 0.83) % 7).toFixed(2)}s`;

  return (
    <svg
      viewBox="-300 -300 600 600"
      className={className}
      role="img"
      aria-label="Ripple Church rose window"
    >
      <defs>
        {Object.entries(GLASS).map(([name, [hi, mid, lo]]) => (
          <radialGradient key={name} id={`g-${name}`} cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor={hi} />
            <stop offset="55%" stopColor={mid} />
            <stop offset="100%" stopColor={lo} />
          </radialGradient>
        ))}

        <radialGradient id="g-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffdf5" />
          <stop offset="28%" stopColor="#ffe9b0" />
          <stop offset="62%" stopColor="#5d86f0" />
          <stop offset="100%" stopColor="#0d1c5c" />
        </radialGradient>

        <linearGradient id="g-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3a22" />
          <stop offset="50%" stopColor="#2a2014" />
          <stop offset="100%" stopColor="#140f09" />
        </linearGradient>

        <linearGradient id="g-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        {/* 손으로 분 유리의 얼룩·기포 */}
        <filter id="glass-texture" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.032" numOctaves="3" seed="7" />
          <feColorMatrix
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 1.6 -0.55"
          />
        </filter>
        <filter id="glass-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.9 -0.3"
          />
        </filter>

        <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>

        <clipPath id="window-clip">
          <circle r="262" />
        </clipPath>
      </defs>

      {/* 돌 테두리 */}
      <circle r="292" fill="url(#g-stone)" />
      <circle r="292" fill="none" stroke="#e2bb62" strokeOpacity="0.55" strokeWidth="1.5" />
      <circle r="270" fill="none" stroke="#e2bb62" strokeOpacity="0.35" strokeWidth="1" />
      {Array.from({ length: 48 }).map((_, i) => {
        const c = circleAt(281, (i / 48) * TAU);
        return <circle key={`stud-${i}`} {...c} r="3.2" fill="#6b5430" stroke="#120d08" strokeWidth="1" />;
      })}

      <g clipPath="url(#window-clip)">
        {/* 바탕: 깊은 밤색 유리 */}
        <circle r="262" fill="url(#g-night)" />

        <g className="rose-spin">
          {/* 바깥 원형 메달(라운델) 고리 */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * TAU + TAU / 48;
            const c = circleAt(243, a);
            const color = roundelColors[i % roundelColors.length];
            return (
              <g key={`roundel-${i}`}>
                <circle
                  {...c}
                  r="17"
                  fill={`url(#g-${color})`}
                  stroke={LEAD}
                  strokeWidth="3.5"
                  className="rose-pane"
                  style={{ animationDelay: delay() }}
                />
                <circle {...c} r="6" fill="url(#g-pale)" stroke={LEAD} strokeWidth="2" />
              </g>
            );
          })}
          <circle r="224" fill="none" stroke={LEAD} strokeWidth="5" />
          <circle r="262" fill="none" stroke={LEAD} strokeWidth="5" />
        </g>

        {/* 꽃잎 사이 삼각 조각(스팬드럴) */}
        {Array.from({ length: PETALS }).map((_, i) => {
          const a = i * step + step / 2;
          return (
            <path
              key={`spandrel-${i}`}
              d={sector(150, 224, a - step * 0.22, a + step * 0.22)}
              fill={`url(#g-${i % 2 ? "violet" : "emerald"})`}
              stroke={LEAD}
              strokeWidth="3"
              className="rose-pane"
              style={{ animationDelay: delay(), opacity: 0.9 }}
            />
          );
        })}

        {/* 꽃잎 12장 */}
        {Array.from({ length: PETALS }).map((_, i) => {
          const a = i * step;
          const color = petalColors[i % petalColors.length];
          const oc = circleAt(178, a);
          const split = 140;
          return (
            <g key={`petal-${i}`}>
              <path
                d={petal(102, 222, a, step * 0.42)}
                fill={`url(#g-${color})`}
                stroke={LEAD}
                strokeWidth="4.5"
                strokeLinejoin="round"
                className="rose-pane"
                style={{ animationDelay: delay() }}
              />
              {/* 꽃잎 안 납선 */}
              <path
                d={`M${p(split, a - step * 0.36)} A${split} ${split} 0 0 1 ${p(split, a + step * 0.36)}`}
                fill="none"
                stroke={LEAD}
                strokeWidth="3"
              />
              <path d={`M${p(102, a)} L${p(split, a)}`} stroke={LEAD} strokeWidth="2.5" />
              <circle
                {...oc}
                r="19"
                fill={`url(#g-${oculusColors[i % oculusColors.length]})`}
                stroke={LEAD}
                strokeWidth="3.5"
                className="rose-pane"
                style={{ animationDelay: delay() }}
              />
              <circle {...oc} r="7" fill="none" stroke={LEAD} strokeWidth="2" />
            </g>
          );
        })}

        {/* 안쪽 고리 */}
        {Array.from({ length: PETALS }).map((_, i) => {
          const a0 = i * step - step / 2;
          return (
            <path
              key={`inner-${i}`}
              d={sector(74, 102, a0, a0 + step)}
              fill={`url(#g-${innerColors[i % innerColors.length]})`}
              stroke={LEAD}
              strokeWidth="3.5"
              className="rose-pane"
              style={{ animationDelay: delay() }}
            />
          );
        })}

        {/* 중앙 메달리온: 파동을 내는 사람 */}
        <circle r="74" fill="url(#g-core)" stroke={LEAD} strokeWidth="5" />
        <circle r="44" fill="#fff4cf" opacity="0.55" filter="url(#core-glow)" />
        {[30, 46, 62].map((r, i) => (
          <circle
            key={`wave-${r}`}
            r={r}
            fill="none"
            stroke={LEAD}
            strokeWidth={2.4 - i * 0.4}
            strokeOpacity={0.85 - i * 0.2}
          />
        ))}
        {[34, 50].map((r, i) => (
          <circle
            key={`pulse-${r}`}
            r={r}
            fill="none"
            stroke="#fff4cf"
            strokeWidth="1.4"
            className="ripple-ring"
            style={{ animationDelay: `${i * 1.5}s`, transformOrigin: "0 0" }}
          />
        ))}
        <g transform="translate(0 6) scale(0.62)">
          <circle cx="0" cy="-48" r="18" fill={LEAD} />
          <path
            d="M-28 -18 Q-34 16 -30 46 L30 46 Q34 16 28 -18 Q12 -30 0 -30 Q-12 -30 -28 -18Z"
            fill={LEAD}
          />
        </g>

        {/* 유리 질감 */}
        <rect
          x="-262"
          y="-262"
          width="524"
          height="524"
          filter="url(#glass-texture)"
          opacity="0.22"
          style={{ mixBlendMode: "soft-light" }}
        />
        <rect
          x="-262"
          y="-262"
          width="524"
          height="524"
          filter="url(#glass-grain)"
          opacity="0.35"
          style={{ mixBlendMode: "multiply" }}
        />

        {/* 지나가는 빛 */}
        <rect
          x="-140"
          y="-420"
          width="120"
          height="840"
          fill="url(#g-sweep)"
          className="rose-sweep"
          style={{ mixBlendMode: "screen" }}
        />
      </g>

      <circle r="262" fill="none" stroke="#e2bb62" strokeOpacity="0.5" strokeWidth="1.2" />
    </svg>
  );
}
