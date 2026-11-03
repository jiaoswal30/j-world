import { useId } from 'react';
import type { ArtKind } from '../content/site';

/*
 * Moodboards and process sketches, drawn in code so they stay sharp at any size.
 * The pencil feel comes from an SVG displacement filter, not from images.
 */

const HAND = { fontFamily: 'Reenie Beanie, cursive' };
const MONO = { fontFamily: 'IBM Plex Mono, monospace', letterSpacing: 1.5 };
const DISPLAY = { fontFamily: 'Gloock, serif' };
const SCRIPT = { fontFamily: 'Pinyon Script, cursive' };

const useSvgId = () => useId().replace(/[^a-zA-Z0-9]/g, '');

/** An almond eye: the NAZAAR motif. */
function Eye({ x, y, s, stroke, iris, dash, lashes = true, sw = 3 }: { x: number; y: number; s: number; stroke: string; iris: string; dash?: string; lashes?: boolean; sw?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1 0 Q0 -0.62 1 0 Q0 0.62 -1 0 Z" fill="none" stroke={stroke} strokeWidth={sw / s} strokeDasharray={dash} strokeLinejoin="round" />
      <circle r="0.3" fill="none" stroke={iris} strokeWidth={(sw * 1.4) / s} strokeDasharray={dash} />
      <circle r="0.13" fill="#120810" />
      <circle cx="0.06" cy="-0.06" r="0.04" fill="#fff" />
      {lashes &&
        [-0.7, -0.35, 0, 0.35, 0.7].map((t) => (
          <line key={t} x1={t} y1={-0.42 + Math.abs(t) * 0.18} x2={t * 1.25} y2={-0.66 + Math.abs(t) * 0.2} stroke={stroke} strokeWidth={sw / s / 1.4} strokeLinecap="round" />
        ))}
    </g>
  );
}

function Note({ x, y, r, w, lines, size = 30 }: { x: number; y: number; r: number; w: number; lines: string[]; size?: number }) {
  const h = 26 + lines.length * size * 0.86;
  return (
    <g transform={`rotate(${r} ${x + w / 2} ${y + h / 2})`}>
      <path d={`M${x} ${y + 3} L${x + w * 0.3} ${y} L${x + w * 0.62} ${y + 4} L${x + w} ${y + 1} L${x + w - 2} ${y + h} L${x + w * 0.5} ${y + h - 3} L${x + 2} ${y + h + 1} Z`} fill="#F3ECDD" />
      <rect x={x + w / 2 - 30} y={y - 10} width="60" height="20" fill="#D4D000" opacity="0.7" transform={`rotate(${-r * 1.5} ${x + w / 2} ${y})`} />
      {lines.map((l, i) => (
        <text key={i} x={x + 16} y={y + 18 + (i + 1) * size * 0.86} fontSize={size} fill="#1E0A20" {...HAND}>
          {l}
        </text>
      ))}
    </g>
  );
}

/** NAZAAR, rebel cut — a moodboard for Room 01 that stares back. */
function NazaarBoard() {
  const id = useSvgId();
  const swatches = [
    ['#D4D000', 'ACID'],
    ['#4A1442', 'AUBERGINE'],
    ['#2B3A5C', 'RAW DENIM'],
    ['#C8102E', 'THREAD RED'],
    ['#EFE7D6', 'BONE'],
  ];
  return (
    <svg className="artwork" viewBox="0 0 800 1000" role="img" aria-label="NAZAAR rebel-cut moodboard">
      <defs>
        <filter id={`${id}grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" />
        </filter>
        <pattern id={`${id}twill`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <rect width="7" height="7" fill="#2B3A5C" />
          <rect width="2.4" height="7" fill="#3A4C74" />
        </pattern>
        <pattern id={`${id}eyes`} width="70" height="56" patternUnits="userSpaceOnUse">
          <rect width="70" height="56" fill="#EFE7D6" />
          <path d="M14 28 Q35 12 56 28 Q35 44 14 28 Z" fill="none" stroke="#1E0A20" strokeWidth="2" />
          <circle cx="35" cy="28" r="6" fill="#1E0A20" />
        </pattern>
      </defs>

      <rect width="800" height="1000" fill="#1E0A20" />
      <rect width="800" height="1000" fill="#4A1442" opacity="0.35" />

      <text x="40" y="52" fontSize="13" fill="#D4D000" {...MONO}>HUM बवाल — ROOM 01 — DROP 001</text>
      <text x="760" y="52" fontSize="13" fill="#EFE7D6" textAnchor="end" opacity="0.7" {...MONO}>MOODBOARD / REBEL CUT</text>

      <text x="34" y="210" fontSize="168" fill="#D4D000" letterSpacing="-2" {...DISPLAY}>NAZAAR</text>
      <text x="300" y="282" fontSize="96" fill="#EFE7D6" transform="rotate(-6 300 282)" {...SCRIPT}>stare back.</text>

      {/* the denim swatch with the stitched eye */}
      <g transform="rotate(4 560 470)">
        <rect x="360" y="330" width="390" height="280" fill={`url(#${id}twill)`} />
        {Array.from({ length: 34 }, (_, i) => (
          <line key={i} x1={366 + i * 11.4} y1="610" x2={364 + i * 11.4 + ((i * 7) % 5) - 2} y2={622 + ((i * 13) % 11)} stroke="#6E82AE" strokeWidth="1.4" />
        ))}
        <rect x="372" y="342" width="366" height="256" fill="none" stroke="#D4D000" strokeWidth="1.6" strokeDasharray="7 5" />
        <Eye x={555} y={470} s={130} stroke="#C8102E" iris="#D4D000" dash="9 4" sw={7} />
      </g>
      <rect x="520" y="316" width="96" height="26" fill="#D4D000" opacity="0.65" transform="rotate(-8 568 329)" />

      {/* swatches */}
      {swatches.map(([c, n], i) => (
        <g key={n}>
          <rect x="40" y={330 + i * 74} width="58" height="58" fill={c} stroke="#EFE7D6" strokeOpacity="0.3" />
          <text x="112" y={354 + i * 74} fontSize="12" fill="#EFE7D6" {...MONO}>{n}</text>
          <text x="112" y={372 + i * 74} fontSize="11" fill="#EFE7D6" opacity="0.55" {...MONO}>{c}</text>
        </g>
      ))}

      {/* print of watching eyes */}
      <g transform="rotate(-5 160 790)">
        <rect x="40" y="700" width="250" height="200" fill="#F3ECDD" />
        <rect x="54" y="714" width="222" height="150" fill={`url(#${id}eyes)`} />
        <text x="54" y="888" fontSize="22" fill="#1E0A20" {...HAND}>everyone's looking. good.</text>
      </g>

      {/* nazar dori — the black thread */}
      <path d="M330 660 C 380 620, 420 720, 470 680 S 560 640, 600 700 S 690 760, 760 720" fill="none" stroke="#0B0509" strokeWidth="4" />
      <circle cx="470" cy="681" r="9" fill="#0B0509" />
      <text x="486" y="664" fontSize="24" fill="#EFE7D6" {...HAND}>nazar dori — keep it on</text>

      <Note x={330} y={742} r={-3} w={230} lines={['the eye is armour,', 'not a warning.']} />
      <Note x={566} y={770} r={4} w={196} lines={['seen ≠ owned.']} />
      <Note x={500} y={862} r={-2} w={250} lines={['made slow. worn loud.']} size={28} />

      {/* stamp */}
      <g transform="rotate(-14 288 520)" opacity="0.92">
        <circle cx="288" cy="520" r="62" fill="none" stroke="#C8102E" strokeWidth="3" />
        <circle cx="288" cy="520" r="52" fill="none" stroke="#C8102E" strokeWidth="1.2" />
        <text x="288" y="512" textAnchor="middle" fontSize="13" fill="#C8102E" {...MONO}>7 PIECES</text>
        <text x="288" y="532" textAnchor="middle" fontSize="13" fill="#C8102E" {...MONO}>50 EACH</text>
        <text x="288" y="550" textAnchor="middle" fontSize="10" fill="#C8102E" {...MONO}>NO RESTOCK</text>
      </g>

      <text x="40" y="968" fontSize="12" fill="#D4D000" {...MONO}>GAZE · VISIBILITY · EVIL EYE · RAW HEM · HAND-STITCH · STARE BACK</text>
      <rect width="800" height="1000" filter={`url(#${id}grain)`} />
    </svg>
  );
}

/** Pencil spec sheet for a NAZAAR piece. */
function SketchWatcher() {
  const id = useSvgId();
  const ink = '#2E2B28';
  return (
    <svg className="artwork" viewBox="0 0 750 1000" role="img" aria-label="Process sketch: NAZAAR piece 03, the watcher">
      <defs>
        <pattern id={`${id}grid`} width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M25 0H0V25" fill="none" stroke="#7FA3C8" strokeOpacity="0.22" strokeWidth="1" />
        </pattern>
        <filter id={`${id}pencil`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </defs>
      <rect width="750" height="1000" fill="#F4EFE4" />
      <rect width="750" height="1000" fill={`url(#${id}grid)`} />
      <circle cx="610" cy="140" r="64" fill="none" stroke="#9A6B3A" strokeOpacity="0.16" strokeWidth="9" />

      <text x="40" y="70" fontSize="50" fill={ink} {...HAND}>NAZAAR — pc. 03</text>
      <text x="44" y="108" fontSize="36" fill="#C8102E" {...HAND}>"the watcher"</text>
      <text x="44" y="138" fontSize="12" fill={ink} opacity="0.7" {...MONO}>BACK VIEW · NOT TO SCALE · 03/07</text>

      <g filter={`url(#${id}pencil)`} fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* jeans, back view, wide leg */}
        <path d="M220 190 C 205 400, 190 650, 196 905 L 360 905 C 364 700, 370 520, 378 440 C 386 520, 392 700, 398 905 L 562 905 C 568 650, 550 400, 534 190 Z" />
        <path d="M222 196 C 207 400, 193 650, 199 902" opacity="0.4" />
        <path d="M218 166 L 536 166 L 534 196 L 220 196 Z" />
        {[250, 330, 424, 500].map((x) => (
          <rect key={x} x={x} y="160" width="14" height="42" />
        ))}
        <path d="M222 262 Q 376 304 532 262" />
        <path d="M378 196 L 378 440" strokeDasharray="5 5" />
        {/* pockets */}
        <path d="M246 290 L 346 284 L 340 398 L 296 420 L 252 400 Z" />
        <path d="M410 284 L 510 290 L 504 400 L 460 420 L 416 398 Z" />
        {/* hem fray */}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`a${i}`} x1={202 + i * 11} y1="906" x2={200 + i * 11 + (i % 3)} y2={918 + (i % 4) * 3} strokeWidth="1.2" />
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`b${i}`} x1={404 + i * 11} y1="906" x2={403 + i * 11 + (i % 3)} y2={918 + (i % 4) * 3} strokeWidth="1.2" />
        ))}
        {/* shut eye on the right pocket */}
        <path d="M425 350 Q 460 372 495 350" />
        {[432, 446, 460, 474, 488].map((x, i) => (
          <line key={x} x1={x} y1={356 + (i === 2 ? 4 : 0)} x2={x - 3} y2={370} strokeWidth="1.4" />
        ))}
        {/* belt-loop thread */}
        <path d="M257 198 C 248 228, 268 232, 258 262" stroke="#111" strokeWidth="3" />
        {/* arrows */}
        <path d="M150 300 Q 210 300 262 338" />
        <path d="M254 330 L 262 338 L 250 340" />
        <path d="M600 300 Q 540 318 494 352" />
        <path d="M502 344 L 494 352 L 506 354" />
        <path d="M140 210 Q 200 214 250 232" />
        <path d="M600 920 Q 580 930 562 912" />
      </g>
      <g filter={`url(#${id}pencil)`}>
        <Eye x={296} y={346} s={36} stroke="#C8102E" iris="#B7A700" sw={2.6} />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={268 + i * 7} y1="382" x2={276 + i * 7} y2="372" stroke="#C8102E" strokeOpacity="0.45" strokeWidth="1.4" />
        ))}
      </g>

      <text x="20" y="262" fontSize="28" fill={ink} {...HAND}>hand-stitched,</text>
      <text x="20" y="290" fontSize="28" fill={ink} {...HAND}>red satin fill</text>
      <text x="40" y="200" fontSize="26" fill={ink} {...HAND}>nazar dori</text>
      <text x="560" y="250" fontSize="27" fill={ink} {...HAND}>one eye open,</text>
      <text x="560" y="278" fontSize="27" fill={ink} {...HAND}>one shut. you</text>
      <text x="560" y="306" fontSize="27" fill={ink} {...HAND}>never know which</text>
      <text x="560" y="334" fontSize="27" fill={ink} {...HAND}>one's watching</text>
      <text x="590" y="660" fontSize="27" fill={ink} {...HAND}>wide leg,</text>
      <text x="590" y="688" fontSize="27" fill={ink} {...HAND}>heavy 14 oz</text>
      <text x="590" y="948" fontSize="27" fill={ink} {...HAND}>raw hem —</text>
      <text x="590" y="974" fontSize="27" fill={ink} {...HAND}>let it fray</text>

      <g transform="rotate(-3 120 960)">
        <rect x="34" y="922" width="290" height="58" fill="none" stroke="#C8102E" strokeWidth="2" />
        <text x="48" y="961" fontSize="32" fill="#C8102E" {...HAND}>50 units. no restock.</text>
      </g>
      <g transform="translate(40 560)">
        <text y="0" fontSize="12" fill={ink} {...MONO}>THREAD</text>
        {['#C8102E', '#B7A700', '#111'].map((c, i) => (
          <path key={c} d={`M${i * 34} 14 q 10 -8 22 0 q -10 10 -22 0`} fill={c} opacity="0.85" />
        ))}
      </g>
    </svg>
  );
}

/** The storyboard for this site, as it might have looked on paper first. */
function SketchStoryboard() {
  const id = useSvgId();
  const ink = '#2E2B28';
  const frames: { x: number; y: number; n: string; note: string }[] = [
    { x: 50, y: 150, n: '01', note: 'title over a spinning earth' },
    { x: 430, y: 150, n: '02', note: 'scroll = dive. through the clouds' },
    { x: 810, y: 150, n: '03', note: 'india → karnataka (zoom!)' },
    { x: 50, y: 520, n: '04', note: 'pin opens like an aperture' },
    { x: 430, y: 520, n: '05', note: 'the shop. doors swing in' },
    { x: 810, y: 520, n: '06', note: 'pick a record → it plays' },
  ];
  return (
    <svg className="artwork" viewBox="0 0 1200 900" role="img" aria-label="Storyboard sketch for Jia's World">
      <defs>
        <filter id={`${id}pencil`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="9" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
        <pattern id={`${id}hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line y2="8" stroke={ink} strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="1200" height="900" fill="#F6F1E6" />
      {Array.from({ length: 30 }, (_, i) => (
        <line key={i} x1="0" x2="1200" y1={30 + i * 30} y2={30 + i * 30} stroke="#7FA3C8" strokeOpacity="0.14" />
      ))}
      <text x="50" y="80" fontSize="56" fill={ink} {...HAND}>jia's world — storyboard v1</text>
      <text x="54" y="114" fontSize="13" fill={ink} opacity="0.7" {...MONO}>SCROLL-DRIVEN · ONE CONTINUOUS CAMERA · NO HIJACKING</text>

      <g filter={`url(#${id}pencil)`} fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {frames.map((f) => (
          <rect key={f.n} x={f.x} y={f.y} width="340" height="220" />
        ))}
        {/* 01 earth */}
        <circle cx="220" cy="270" r="74" />
        <path d="M176 236 q 20 -14 40 4 q 10 24 -12 40 q -18 10 -30 -6 Z M236 282 q 22 -8 30 14 q -6 22 -30 18 Z" />
        <path d="M120 186 l 4 0 M330 200 l 4 0 M300 340 l 4 0 M90 320 l 4 0" strokeWidth="3" />
        <text x="140" y="196" fontSize="34" stroke="none" fill="#2A8C80" {...SCRIPT}>Jia's World</text>
        {/* 02 clouds */}
        <path d="M470 250 q 20 -40 60 -20 q 30 -30 64 0 q 40 -6 40 30 q 10 30 -30 34 l -120 0 q -40 -6 -14 -44 Z" />
        <path d="M560 320 q 16 -26 46 -12 q 24 -16 44 6 q 26 4 16 26 l -96 0 q -24 -4 -10 -20 Z" />
        <path d="M600 180 L 600 236 M590 226 L 600 238 L 610 226" />
        {/* 03 india */}
        <path d="M930 176 l 40 6 l 30 20 l 16 34 l 50 10 l -6 26 l -40 6 l -26 40 l -20 46 l -18 -6 l -14 -50 l -24 -40 l -10 -30 l 16 -22 Z" />
        <path d="M948 286 l 30 -6 l 6 30 l -12 26 l -16 -10 Z" fill={`url(#${id}hatch)`} />
        <path d="M1010 250 Q 1070 250 1088 210" strokeDasharray="5 5" />
        {/* 04 pin */}
        <circle cx="220" cy="630" r="10" fill={ink} />
        <circle cx="220" cy="630" r="28" />
        <circle cx="220" cy="630" r="54" strokeDasharray="6 6" />
        <circle cx="220" cy="630" r="84" strokeDasharray="2 8" />
        {/* 05 shop */}
        <path d="M480 720 L 480 580 L 770 580 L 770 720" />
        <rect x="496" y="592" width="258" height="30" />
        <rect x="596" y="640" width="58" height="80" />
        <path d="M596 640 L 610 650 L 610 720 M654 640 L 640 650 L 640 720" />
        <rect x="500" y="640" width="76" height="56" />
        <rect x="674" y="640" width="76" height="56" />
        {/* 06 room */}
        <circle cx="980" cy="620" r="70" />
        <rect x="930" y="640" width="100" height="34" />
        <ellipse cx="970" cy="652" rx="26" ry="8" />
        <path d="M850 690 L 1110 690" />
        {[868, 918, 968, 1018, 1068].map((x) => (
          <rect key={x} x={x} y="696" width="34" height="34" />
        ))}
        {/* arrows between frames */}
        <path d="M392 260 L 426 260 M416 252 L 428 260 L 416 268" />
        <path d="M772 260 L 806 260 M796 252 L 808 260 L 796 268" />
        <path d="M980 374 C 980 450, 220 430, 220 512 M212 502 L 220 514 L 228 502" strokeDasharray="7 6" />
        <path d="M392 630 L 426 630 M416 622 L 428 630 L 416 638" />
        <path d="M772 630 L 806 630 M796 622 L 808 630 L 796 638" />
      </g>
      <text x="501" y="613" fontSize="13" fill={ink} {...MONO}>THE LISTENING ROOM</text>
      <text x="250" y="660" fontSize="26" fill="#C8102E" {...HAND}>bengaluru</text>

      {frames.map((f) => (
        <g key={`t${f.n}`}>
          <text x={f.x} y={f.y - 10} fontSize="13" fill={ink} {...MONO}>{f.n}</text>
          <text x={f.x} y={f.y + 256} fontSize="30" fill={ink} {...HAND}>{f.note}</text>
        </g>
      ))}

      <g transform="rotate(3 1010 830)">
        <rect x="860" y="790" width="300" height="80" fill="#F1C979" opacity="0.85" />
        <text x="876" y="826" fontSize="28" fill={ink} {...HAND}>if it moves, it should</text>
        <text x="876" y="856" fontSize="28" fill={ink} {...HAND}>mean something. — J.</text>
      </g>
    </svg>
  );
}

export function Artwork({ kind }: { kind: ArtKind }) {
  if (kind === 'nazaar-board') return <NazaarBoard />;
  if (kind === 'sketch-watcher') return <SketchWatcher />;
  return <SketchStoryboard />;
}
