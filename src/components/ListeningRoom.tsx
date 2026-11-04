import { useId, useMemo } from 'react';
import { seeded } from '../lib/rich';

const C = {
  ink: '#1C1512',
  paper: '#EFE7D6',
  oxblood: '#5E1A1F',
  oxblood2: '#7E2A2C',
  saffron: '#E0A43A',
  cobalt: '#2335C8',
  celadon: '#A9BCA0',
  celadonDeep: '#4E6151',
  walnut: '#4A2E21',
  walnut2: '#6B4430',
  leaf: '#3E5A3F',
};

// tonal spines (walnut, oxblood, paper) with a rare accent — a curated shelf, not a rainbow
const SPINE_COLOURS = [
  '#2A1E19', '#3A2A22', C.walnut, C.walnut, '#6B4430', '#8C5A3C', C.oxblood, C.oxblood, '#B79A74', '#D8CDB4', '#E6DCC6', C.celadonDeep, C.ink,
];

type Rect = { x: number; y: number; w: number; h: number; fill: string; r?: number; band?: string };
type FaceOut = { x: number; y: number; s: number; a: string; b: string; kind: number; r: number };

/** Fill one shelf bay with records, deterministically. */
function buildBay(x0: number, x1: number, rows: [number, number][], seed: number) {
  const rnd = seeded(seed);
  const spines: Rect[] = [];
  const faces: FaceOut[] = [];
  const pick = () => SPINE_COLOURS[Math.floor(rnd() * SPINE_COLOURS.length)];

  rows.forEach(([top, bottom], rowIdx) => {
    let x = x0 + 16;
    const rowH = bottom - top;
    let facesInRow = 0;
    while (x < x1 - 18) {
      const roll = rnd();
      const room = x1 - 16 - x;
      if (roll < 0.06 && facesInRow < 1 && room > 130 && (rowIdx + seed) % 2 === 0) {
        const s = rowH - 18;
        faces.push({ x, y: bottom - s, s, a: pick(), b: pick(), kind: Math.floor(rnd() * 3), r: (rnd() - 0.5) * 3 });
        x += s + 6;
        facesInRow++;
      } else if (roll < 0.1 && room > 40) {
        // a gap with a record leaning into it
        const w = 8 + rnd() * 3;
        const h = rowH - 14 - rnd() * 10;
        spines.push({ x: x + 10, y: bottom - h, w, h, fill: pick(), r: 12 + rnd() * 8 });
        x += 30 + rnd() * 12;
      } else {
        const w = 5 + Math.floor(rnd() * 7);
        const h = rowH - 6 - Math.floor(rnd() * 16);
        const fill = pick();
        spines.push({ x, y: bottom - h, w, h, fill, band: rnd() < 0.3 ? 'rgba(239,231,214,.55)' : undefined });
        x += w + (rnd() < 0.85 ? 0.6 : 2);
      }
    }
  });
  return { spines, faces };
}

/** Floor in one-point perspective: oxblood & chalk checker. */
function buildFloor() {
  const tiles: { d: string; dark: boolean }[] = [];
  const vx = 800;
  const vy = 300;
  const hf = 460; // y = vy + hf / z
  const proj = (X: number, Z: number) => [vx + (X * 820) / Z, vy + hf / Z];
  const zs: number[] = [];
  for (let z = 1; z > 0.6; z -= 0.065) zs.push(z);
  zs.push(0.6);
  for (let i = 0; i < zs.length - 1; i++) {
    for (let j = -14; j < 14; j++) {
      const x0 = j * 0.11;
      const x1 = (j + 1) * 0.11;
      const a = proj(x0, zs[i]);
      const b = proj(x1, zs[i]);
      const c = proj(x1, zs[i + 1]);
      const d = proj(x0, zs[i + 1]);
      if (Math.max(a[0], b[0], c[0], d[0]) < -50 || Math.min(a[0], b[0], c[0], d[0]) > 1650) continue;
      tiles.push({
        d: `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}L${c[0].toFixed(1)} ${c[1].toFixed(1)}L${d[0].toFixed(1)} ${d[1].toFixed(1)}Z`,
        dark: (i + j) % 2 === 0,
      });
    }
  }
  return tiles;
}

const ROWS: [number, number][] = [
  [162, 300],
  [312, 450],
  [462, 600],
  [612, 750],
];

function Bay({ x0, x1, seed }: { x0: number; x1: number; seed: number }) {
  const { spines, faces } = useMemo(() => buildBay(x0, x1, ROWS, seed), [x0, x1, seed]);
  return (
    <g>
      <rect x={x0} y="140" width={x1 - x0} height="622" fill="#2E1C14" />
      {spines.map((s, i) => (
        <g key={i} transform={s.r ? `rotate(${s.r} ${s.x + s.w} ${s.y + s.h})` : undefined}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h} fill={s.fill} />
          {s.band && <rect x={s.x} y={s.y + 10} width={s.w} height="7" fill={s.band} />}
        </g>
      ))}
      {faces.map((f, i) => (
        <g key={`f${i}`} transform={`rotate(${f.r} ${f.x + f.s / 2} ${f.y + f.s})`}>
          <rect x={f.x} y={f.y} width={f.s} height={f.s} fill={f.a} />
          {f.kind === 0 && <circle cx={f.x + f.s * 0.55} cy={f.y + f.s * 0.45} r={f.s * 0.28} fill={f.b} />}
          {f.kind === 1 && <rect x={f.x} y={f.y + f.s * 0.55} width={f.s} height={f.s * 0.45} fill={f.b} />}
          {f.kind === 2 && <path d={`M${f.x} ${f.y + f.s} A${f.s * 0.5} ${f.s * 0.5} 0 0 1 ${f.x + f.s} ${f.y + f.s} Z`} fill={f.b} />}
          <rect x={f.x} y={f.y} width={f.s} height={f.s} fill="none" stroke="rgba(0,0,0,.25)" />
        </g>
      ))}
      {[150, 300, 450, 600, 750].map((y) => (
        <g key={y}>
          <rect x={x0 - 6} y={y} width={x1 - x0 + 12} height="12" fill={C.walnut2} />
          <rect x={x0 - 6} y={y} width={x1 - x0 + 12} height="2" fill="#94634A" />
          <rect x={x0 - 6} y={y + 12} width={x1 - x0 + 12} height="5" fill="rgba(0,0,0,.25)" />
        </g>
      ))}
      <rect x={x0 - 10} y="140" width="14" height="622" fill={C.walnut} />
      <rect x={x1 - 4} y="140" width="14" height="622" fill={C.walnut} />
    </g>
  );
}

export function RoomArt() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const u = (n: string) => `url(#${id}${n})`;
  const floor = useMemo(buildFloor, []);

  return (
    <svg className="stage__art" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}wall`} cx="0.5" cy="0.38" r="0.75">
          <stop offset="0" stopColor="#F3E9D3" />
          <stop offset="0.6" stopColor="#E2D5BA" />
          <stop offset="1" stopColor="#C9B996" />
        </radialGradient>
        <radialGradient id={`${id}pool`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD58A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}flute`} width="16" height="10" patternUnits="userSpaceOnUse">
          <rect width="16" height="10" fill="#4F3122" />
          <rect width="9" height="10" fill="#6B4430" />
          <rect x="1" width="2" height="10" fill="#87583E" />
        </pattern>
        <linearGradient id={`${id}shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`${id}floorShade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C1512" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1C1512" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ceiling + walls */}
      <rect width="1600" height="1000" fill={u('wall')} />
      <rect width="1600" height="40" fill="#C2B392" />
      <rect y="40" width="1600" height="3" fill="#A99A7A" />
      <rect y="112" width="1600" height="6" fill="#B8A787" />
      <rect y="596" width="1600" height="6" fill="#3D0E12" />
      <rect y="602" width="1600" height="160" fill={C.oxblood} />

      {/* the cobalt disc — the room's one loud gesture */}
      <circle cx="800" cy="330" r="235" fill={C.cobalt} />
      <circle cx="800" cy="330" r="206" fill="none" stroke={C.paper} strokeWidth="1.2" opacity="0.45" />
      {/* shelving bays */}
      <Bay x0={44} x1={466} seed={7} />
      <Bay x0={1134} x1={1556} seed={23} />

      {/* pendant lamps */}
      {[640, 960].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="340" rx="190" ry="230" fill={u('pool')} />
          <line x1={x} y1="40" x2={x} y2="150" stroke={C.ink} strokeWidth="2" />
          <path d={`M${x - 46} 190 Q${x} 128 ${x + 46} 190 Z`} fill={C.saffron} />
          <path d={`M${x - 46} 190 Q${x} 128 ${x + 46} 190`} fill="none" stroke="#B07422" strokeWidth="2" />
          <ellipse cx={x} cy="190" rx="46" ry="6" fill="#FFF0C4" />
        </g>
      ))}

      {/* floor */}
      <rect y="760" width="1600" height="240" fill={C.paper} />
      {floor.map((t, i) => (
        <path key={i} d={t.d} fill={t.dark ? '#7B4542' : '#E6DAC4'} />
      ))}
      <rect y="760" width="1600" height="240" fill={u('floorShade')} />
      <rect y="758" width="1600" height="6" fill={C.walnut} />

      {/* counter / listening station */}
      <ellipse cx="800" cy="806" rx="470" ry="16" fill="#000" opacity="0.28" />
      <rect x="380" y="563" width="840" height="224" fill={u('flute')} />
      <rect x="380" y="563" width="840" height="224" fill={u('shade')} />
      <rect x="370" y="545" width="860" height="20" fill="#7A4B33" />
      <rect x="370" y="545" width="860" height="3" fill="#A86F4D" />
      <rect x="380" y="785" width="840" height="14" fill={C.ink} />
      <rect x="380" y="600" width="840" height="3" fill={C.saffron} opacity="0.5" />

      {/* lamp on counter */}
      <ellipse cx="470" cy="470" rx="120" ry="90" fill={u('pool')} />
      <rect x="466" y="470" width="8" height="76" fill="#C98B2B" />
      <ellipse cx="470" cy="544" rx="26" ry="5" fill="#B07422" />
      <path d="M424 476 Q470 404 516 476 Z" fill={C.saffron} />
      <ellipse cx="470" cy="476" rx="46" ry="5" fill="#FFF0C4" />

      {/* plant */}
      <path d="M1150 495 H1200 L1194 545 H1156 Z" fill={C.oxblood2} />
      {[
        [1175, 470, 34, 14, -30],
        [1160, 455, 30, 12, -60],
        [1192, 452, 32, 12, 40],
        [1178, 430, 28, 11, -10],
        [1205, 476, 26, 10, 70],
        [1148, 480, 24, 10, -80],
      ].map(([cx, cy, rx, ry, r], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={i % 2 ? C.leaf : C.celadonDeep} transform={`rotate(${r} ${cx} ${cy})`} />
      ))}

    </svg>
  );
}

