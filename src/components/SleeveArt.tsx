import { useId } from 'react';
import type { Art } from '../content/site';

const P = {
  ink: '#1C1512',
  paper: '#EFE7D6',
  paper3: '#F6F1E6',
  oxblood: '#5E1A1F',
  celadon: '#A9BCA0',
  saffron: '#E0A43A',
  cobalt: '#2335C8',
  denim: '#2B3A5C',
  lilac: '#C9B8E8',
  ice: '#CFE3EA',
};

const useSvgId = () => useId().replace(/[^a-zA-Z0-9]/g, '');

function lissajous() {
  const pts: string[] = [];
  for (let i = 0; i <= 240; i++) {
    const t = (i / 240) * Math.PI * 2;
    pts.push(`${(100 + 64 * Math.sin(3 * t + Math.PI / 2)).toFixed(1)},${(96 + 60 * Math.sin(2 * t)).toFixed(1)}`);
  }
  return `M${pts.join('L')}`;
}
const LISSAJOUS = lissajous();

/** Original cover artwork for each record. 200×200 viewBox, scales to any size. */
export function SleeveArt({ art, code }: { art: Art; code: string }) {
  const id = useSvgId();
  const mono = { fontFamily: 'IBM Plex Mono, monospace', fontSize: 7.5, letterSpacing: 1.4 };

  switch (art) {
    case 'person':
      return (
        <svg viewBox="0 0 200 200" className="sleeve-art" aria-hidden="true">
          <rect width="200" height="200" fill={P.saffron} />
          <circle cx="122" cy="86" r="60" fill={P.cobalt} />
          <circle cx="122" cy="86" r="22" fill={P.paper} />
          <circle cx="130" cy="80" r="9" fill={P.ink} />
          <path d="M0 200 A88 88 0 0 1 150 200 Z" fill={P.oxblood} />
          <path d="M150 200 A40 40 0 0 1 200 160 V200 Z" fill={P.paper} />
          <text x="14" y="22" fill={P.ink} {...mono}>{code} · THE PERSON</text>
        </svg>
      );
    case 'receipts':
      return (
        <svg viewBox="0 0 200 200" className="sleeve-art" aria-hidden="true">
          <rect width="200" height="200" fill={P.paper3} />
          {Array.from({ length: 18 }, (_, i) => (
            <line key={i} x1="0" x2="200" y1={12 + i * 11} y2={12 + i * 11} stroke="#d9cfb9" strokeWidth="0.6" />
          ))}
          <text x="12" y="108" fill={P.ink} fontFamily="Gloock, serif" fontSize="92">~50</text>
          <text x="14" y="150" fill={P.oxblood} fontFamily="Gloock, serif" fontSize="34">15+</text>
          <text x="14" y="184" fill={P.ink} fontFamily="Gloock, serif" fontSize="22">10+</text>
          <g transform="rotate(-14 150 160)" opacity="0.88">
            <circle cx="150" cy="160" r="30" fill="none" stroke={P.oxblood} strokeWidth="2.4" />
            <circle cx="150" cy="160" r="24" fill="none" stroke={P.oxblood} strokeWidth="0.8" />
            <text x="150" y="158" textAnchor="middle" fill={P.oxblood} {...mono} fontSize="7">ON THE</text>
            <text x="150" y="168" textAnchor="middle" fill={P.oxblood} {...mono} fontSize="7">RECORD</text>
          </g>
          <text x="14" y="22" fill={P.ink} {...mono}>{code} · THE RECEIPTS</text>
        </svg>
      );
    case 'work':
      return (
        <svg viewBox="0 0 200 200" className="sleeve-art" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}ir`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={P.lilac} />
              <stop offset="0.5" stopColor={P.ice} />
              <stop offset="1" stopColor={P.saffron} />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill={P.oxblood} />
          <rect x="34" y="40" width="62" height="62" fill={`url(#${id}ir)`} />
          <rect x="104" y="40" width="62" height="62" fill={P.denim} />
          <rect x="34" y="110" width="62" height="62" fill={P.cobalt} />
          <rect x="104" y="110" width="62" height="62" fill="none" stroke={P.paper} strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M65 52 L80 71 L65 92 L50 71 Z" fill="none" stroke={P.ink} strokeWidth="1.2" />
          <text x="135" y="146" textAnchor="middle" fill={P.paper} fontFamily="Gloock, serif" fontSize="20">+</text>
          <text x="14" y="22" fill={P.paper} {...mono}>{code} · THINGS I'VE BUILT</text>
        </svg>
      );
    case 'experiments':
      return (
        <svg viewBox="0 0 200 200" className="sleeve-art" aria-hidden="true">
          <rect width="200" height="200" fill={P.celadon} />
          <path d={LISSAJOUS} fill="none" stroke={P.ink} strokeWidth="1.6" />
          <circle cx="164" cy="96" r="5" fill={P.oxblood} />
          <rect x="0" y="168" width="200" height="32" fill={P.ink} />
          <text x="14" y="188" fill={P.celadon} {...mono}>{code} · THE EXPERIMENTS</text>
          <text x="14" y="22" fill={P.ink} {...mono}>WORK IN PROGRESS</text>
        </svg>
      );
    case 'last':
      return (
        <svg viewBox="0 0 200 200" className="sleeve-art" aria-hidden="true">
          <rect width="200" height="200" fill={P.cobalt} />
          <circle cx="100" cy="104" r="70" fill="none" stroke={P.saffron} strokeWidth="1.4" />
          <text x="104" y="160" textAnchor="middle" fill={P.paper} fontFamily="Gloock, serif" fontSize="150">?</text>
          <text x="14" y="22" fill={P.paper} {...mono}>{code} · THE LAST TRACK</text>
          <text x="186" y="190" textAnchor="end" fill={P.saffron} {...mono}>WHY ME</text>
        </svg>
      );
  }
}
