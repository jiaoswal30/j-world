import { useId } from 'react';
import type { Project } from '../content/site';

const mono = { fontFamily: 'IBM Plex Mono, monospace', fontSize: 7, letterSpacing: 1.4 };

/** Kaha — a brilliant cut in elevation, lit in the iridescent glass palette. */
function Kaha({ id }: { id: string }) {
  const facets: [string, string][] = [
    ['M60 92 L80 72 L100 92 Z', 'a'],
    ['M80 72 L120 72 L100 92 Z', 'b'],
    ['M100 92 L120 72 L140 92 Z', 'c'],
    ['M38 92 L60 92 L80 72 L58 72 Z', 'b'],
    ['M140 92 L162 92 L142 72 L120 72 Z', 'a'],
    ['M38 92 L60 92 L100 168 Z', 'c'],
    ['M60 92 L100 92 L100 168 Z', 'a'],
    ['M100 92 L140 92 L100 168 Z', 'b'],
    ['M140 92 L162 92 L100 168 Z', 'c'],
  ];
  return (
    <svg viewBox="0 0 200 200" className="cover-art" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6F1E6" />
          <stop offset="0.5" stopColor="#C9B8E8" />
          <stop offset="1" stopColor="#7E6FB0" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE3EA" />
          <stop offset="0.6" stopColor="#8FB4C4" />
          <stop offset="1" stopColor="#F1C979" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#3A3466" />
          <stop offset="0.5" stopColor="#C9B8E8" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
        <radialGradient id={`${id}halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#C9B8E8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#C9B8E8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="#141117" />
      <circle cx="100" cy="112" r="90" fill={`url(#${id}halo)`} />
      {facets.map(([d, g], i) => (
        <path key={i} d={d} fill={`url(#${id}${g})`} stroke="#141117" strokeWidth="0.6" />
      ))}
      <path d="M150 52 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#F6F1E6" />
      <text x="100" y="190" textAnchor="middle" fontFamily="Gloock, serif" fontSize="16" letterSpacing="8" fill="#EFE7D6">KAHA</text>
      <text x="12" y="18" fill="#C9B8E8" {...mono}>B1 · 01</text>
      <text x="188" y="18" textAnchor="end" fill="#C9B8E8" {...mono}>LAB-GROWN</text>
    </svg>
  );
}

/** Hum Bawaal — raw denim, saffron thread, a leather patch with an opinion. */
function HumBawaal({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 200 200" className="cover-art" aria-hidden="true">
      <defs>
        <pattern id={`${id}twill`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <rect width="6" height="6" fill="#2B3A5C" />
          <rect width="2" height="6" fill="#33446A" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill={`url(#${id}twill)`} />
      <path d="M-10 136 Q100 108 210 136" fill="none" stroke="#E0A43A" strokeWidth="1.4" strokeDasharray="5 3" />
      <path d="M-10 142 Q100 114 210 142" fill="none" stroke="#E0A43A" strokeWidth="1.4" strokeDasharray="5 3" />
      <text x="14" y="70" fontFamily="Gloock, serif" fontSize="58" fill="#EFE7D6">HUM</text>
      <text x="14" y="112" fontFamily="Gloock, serif" fontSize="38" letterSpacing="1" fill="#EFE7D6">BAWAAL</text>
      <g transform="rotate(-6 150 170)">
        <rect x="118" y="152" width="66" height="36" rx="2" fill="#8A5A3C" />
        <rect x="122" y="156" width="58" height="28" rx="1" fill="none" stroke="#5E3A26" strokeDasharray="2 2" />
        <text x="151" y="175" textAnchor="middle" fontFamily="Gloock, serif" fontSize="14" fill="#2A1A12">HB</text>
      </g>
      <circle cx="26" cy="168" r="6" fill="#B87333" />
      <circle cx="26" cy="168" r="2.5" fill="#7A4A1E" />
      <text x="14" y="18" fill="#E0A43A" {...mono}>B1 · 02</text>
      <text x="188" y="18" textAnchor="end" fill="#E0A43A" {...mono}>DENIM WITH AN OPINION</text>
    </svg>
  );
}

/** AI & digital — a dot grid, a caret, and a voice waveform. */
function Ai() {
  const bars = [6, 14, 26, 18, 40, 52, 30, 62, 44, 22, 34, 56, 70, 48, 26, 38, 20, 12, 28, 8];
  return (
    <svg viewBox="0 0 200 200" className="cover-art" aria-hidden="true">
      <rect width="200" height="200" fill="#2335C8" />
      {Array.from({ length: 11 }, (_, r) =>
        Array.from({ length: 11 }, (_, c) => <circle key={`${r}-${c}`} cx={10 + c * 18} cy={10 + r * 18} r="0.9" fill="#EFE7D6" opacity="0.35" />),
      )}
      {bars.map((h, i) => (
        <rect key={i} x={24 + i * 8} y={100 - h / 2} width="4" height={h} rx="2" fill="#EFE7D6" />
      ))}
      <rect x="24" y="150" width="64" height="2" fill="#E0A43A" />
      <rect x="92" y="140" width="2.5" height="16" fill="#E0A43A" />
      <text x="14" y="18" fill="#EFE7D6" {...mono}>B1 · 04</text>
      <text x="14" y="184" fill="#EFE7D6" {...mono}>AI &amp; DIGITAL EXPERIMENTS</text>
    </svg>
  );
}

/** Jalsa — a riso invitation: halftone pink sun, blue type, a pink bar. */
function Jalsa({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 200 200" className="cover-art" aria-hidden="true">
      <defs>
        <pattern id={`${id}dots`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.7" fill="#F0479A" />
        </pattern>
        <radialGradient id={`${id}fade`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id={`${id}m`}>
          <circle cx="138" cy="66" r="62" fill={`url(#${id}fade)`} />
        </mask>
      </defs>
      <rect width="200" height="200" fill="#ECE6DA" />
      <rect width="200" height="200" fill={`url(#${id}dots)`} mask={`url(#${id}m)`} />
      <text x="16" y="104" fontFamily="Pinyon Script, cursive" fontSize="58" fill="#1C1512">jalsa</text>
      <text x="126" y="76" fontFamily="sans-serif" fontSize="12" fill="#3B3FC4">जलसा</text>
      <rect x="14" y="134" width="120" height="20" fill="#F0479A" />
      <text x="18" y="130" fontFamily="Gloock, serif" fontSize="17" fill="#3B3FC4">AN INVITATION</text>
      <text x="18" y="150" fontFamily="Gloock, serif" fontSize="17" fill="#3B3FC4">PRESS</text>
      <text x="12" y="18" fill="#1C1512" {...mono}>B1 · 03</text>
      <text x="188" y="188" textAnchor="end" fill="#1C1512" {...mono}>PROP. JIA OSWAL</text>
    </svg>
  );
}

export function ProjectCover({ kind }: { kind: Project['cover'] }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  if (kind === 'kaha') return <Kaha id={id} />;
  if (kind === 'humbawaal') return <HumBawaal id={id} />;
  if (kind === 'jalsa') return <Jalsa id={id} />;
  return <Ai />;
}
