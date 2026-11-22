/**
 * 첨두아치 창(Lancet) 안에 들어가는 스테인드글라스.
 * 바탕은 마름모 격자 유리, 가운데 메달리온에 상징(symbol)을 둔다.
 */

type Symbol = "book" | "wave" | "voice";

type Props = {
  id: string;
  base: string; // 바탕 유리 본색
  deep: string; // 바탕 그늘
  medal: string; // 메달리온 색
  symbol: Symbol;
};

const LEAD = "#120d08";

function SymbolMark({ symbol }: { symbol: Symbol }) {
  if (symbol === "book") {
    return (
      <g fill="none" stroke={LEAD} strokeWidth="3.2" strokeLinejoin="round">
        <path d="M-22 -14 Q-11 -19 0 -13 L0 17 Q-11 11 -22 16Z" fill="#fff6dc" />
        <path d="M22 -14 Q11 -19 0 -13 L0 17 Q11 11 22 16Z" fill="#ffe7a8" />
      </g>
    );
  }
  if (symbol === "wave") {
    return (
      <g fill="none" stroke={LEAD} strokeLinecap="round">
        <circle r="5" fill="#fff6dc" strokeWidth="2.5" />
        <circle r="13" strokeWidth="2.6" />
        <circle r="21" strokeWidth="2.2" strokeOpacity="0.8" />
      </g>
    );
  }
  return (
    <g stroke={LEAD} strokeWidth="3" strokeLinejoin="round">
      <path d="M-20 -14 H20 V8 H2 L-8 18 V8 H-20Z" fill="#fff6dc" />
      <path d="M-11 -4 H11 M-11 2 H5" strokeWidth="2.2" />
    </g>
  );
}

/** 첨두아치: 양쪽 호가 꼭대기에서 만난다 */
const arch = (inset: number, W: number, H: number, spring: number, R: number) => {
  const x0 = inset;
  const x1 = W - inset;
  const r = R - inset;
  const cx = W / 2;
  const apexY = spring - Math.sqrt(r * r - (x0 + r - cx) ** 2);
  return `M${x0} ${H} L${x0} ${spring} A${r} ${r} 0 0 1 ${cx} ${apexY.toFixed(2)} A${r} ${r} 0 0 1 ${x1} ${spring} L${x1} ${H}Z`;
};

export default function LancetWindow({ id, base, deep, medal, symbol }: Props) {
  const W = 120;
  const H = 210;
  const SPRING = 90;
  const R = 100;
  const cols = 4;
  const rows = 9;
  const dw = W / cols;
  const dh = H / rows;

  const diamonds: { d: string; shade: number }[] = [];
  for (let r = -1; r <= rows; r++) {
    for (let c = -1; c <= cols; c++) {
      const cx = c * dw + (r % 2 ? dw / 2 : 0);
      const cy = r * dh;
      diamonds.push({
        d: `M${cx} ${cy - dh / 2} L${cx + dw / 2} ${cy} L${cx} ${cy + dh / 2} L${cx - dw / 2} ${cy}Z`,
        shade: ((r * 7 + c * 3) % 5) / 5,
      });
    }
  }

  const outer = arch(0, W, H, SPRING, R);
  const glass = arch(7, W, H, SPRING, R);
  const trim = arch(11, W, H, SPRING, R);

  return (
    <svg viewBox={`0 -4 ${W} ${H + 4}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3a22" />
          <stop offset="100%" stopColor="#140f09" />
        </linearGradient>
        <radialGradient id={`${id}-base`} cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="35%" stopColor={base} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
        <radialGradient id={`${id}-medal`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="45%" stopColor={medal} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
        <radialGradient id={`${id}-oculus`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="50%" stopColor="#eaa53a" />
          <stop offset="100%" stopColor="#7a4708" />
        </radialGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-tex`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.09" numOctaves="2" seed="11" />
          <feColorMatrix
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 1.4 -0.6"
          />
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={glass} />
        </clipPath>
      </defs>

      {/* 돌 틀 */}
      <path d={outer} fill={`url(#${id}-stone)`} stroke="#e2bb62" strokeOpacity="0.45" strokeWidth="1" />

      <g clipPath={`url(#${id}-clip)`}>
        <rect y="-4" width={W} height={H + 4} fill={`url(#${id}-base)`} />
        {diamonds.map((dm, i) => (
          <path
            key={i}
            d={dm.d}
            fill="#000"
            fillOpacity={dm.shade * 0.28}
            stroke={LEAD}
            strokeWidth="1.6"
          />
        ))}

        {/* 꼭대기 원창 */}
        <circle cx={W / 2} cy="40" r="15" fill={LEAD} />
        <circle cx={W / 2} cy="40" r="12.5" fill={`url(#${id}-oculus)`} />
        {[0, 1, 2].map((k) => {
          const a = (k / 3) * Math.PI * 2 - Math.PI / 2;
          return (
            <circle
              key={k}
              cx={W / 2 + Math.cos(a) * 5.2}
              cy={40 + Math.sin(a) * 5.2}
              r="4.6"
              fill="none"
              stroke={LEAD}
              strokeWidth="1.6"
            />
          );
        })}

        {/* 메달리온 */}
        <g transform={`translate(${W / 2} ${H * 0.58})`}>
          <circle r="34" fill={LEAD} />
          <circle r="31" fill={`url(#${id}-medal)`} stroke={LEAD} strokeWidth="2" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 26}
                y1={Math.sin(a) * 26}
                x2={Math.cos(a) * 31}
                y2={Math.sin(a) * 31}
                stroke={LEAD}
                strokeWidth="2"
              />
            );
          })}
          <SymbolMark symbol={symbol} />
        </g>

        <rect
          y="-4"
          width={W}
          height={H + 4}
          filter={`url(#${id}-tex)`}
          opacity="0.25"
          style={{ mixBlendMode: "soft-light" }}
        />
        <rect
          x="-60"
          y="-40"
          width="50"
          height={H + 80}
          fill={`url(#${id}-sheen)`}
          className="lancet-sheen"
          style={{ mixBlendMode: "screen" }}
        />
      </g>

      <path d={glass} fill="none" stroke={LEAD} strokeWidth="3" />
      <path d={trim} fill="none" stroke="#e2bb62" strokeOpacity="0.45" strokeWidth="0.8" />
    </svg>
  );
}
