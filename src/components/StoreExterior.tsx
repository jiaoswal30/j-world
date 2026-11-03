import { forwardRef, useId } from 'react';
import { exterior } from '../content/site';

const C = {
  ink: '#1C1512',
  paper: '#EFE7D6',
  oxblood: '#5E1A1F',
  lacquerDark: '#3D0E12',
  saffron: '#E0A43A',
  cobalt: '#2335C8',
  cobaltDeep: '#1A2797',
  leaf: '#3E5A3F',
  leafLight: '#577A57',
};

const UPPER_WINDOWS = [400, 800, 1200];

/** Upper-floor window with shutters and a flower box. */
function UpperWindow({ cx, lit, id }: { cx: number; lit?: boolean; id: string }) {
  return (
    <g>
      <rect x={cx - 108} y="130" width="46" height="180" fill="#3F5143" />
      <rect x={cx - 108} y="130" width="46" height="180" fill={`url(#${id}louver)`} />
      <rect x={cx + 62} y="130" width="46" height="180" fill="#3F5143" />
      <rect x={cx + 62} y="130" width="46" height="180" fill={`url(#${id}louver)`} />
      <rect x={cx - 60} y="128" width="120" height="184" fill="#E3DAC6" />
      <rect x={cx - 52} y="136" width="104" height="168" fill={lit ? `url(#${id}glowSoft)` : '#1D2131'} />
      {lit && <rect x={cx - 52} y="136" width="34" height="168" fill="#B9772C" opacity="0.55" />}
      {!lit && <path d={`M${cx - 52} 136 L${cx - 10} 136 L${cx - 52} 200 Z`} fill="#fff" opacity="0.05" />}
      <rect x={cx - 3} y="136" width="6" height="168" fill="#E3DAC6" />
      <rect x={cx - 52} y="216" width="104" height="6" fill="#E3DAC6" />
      <rect x={cx - 72} y="310" width="144" height="9" fill="#D9CFB9" />
      <rect x={cx - 64} y="319" width="128" height="22" fill={C.oxblood} />
      {[-50, -32, -12, 8, 28, 48].map((dx, i) => (
        <circle key={i} cx={cx + dx} cy={312 + (i % 2) * 3} r={11 + (i % 3) * 2} fill={i % 2 ? C.leaf : C.leafLight} />
      ))}
      {[-40, -4, 36].map((dx, i) => (
        <circle key={`f${i}`} cx={cx + dx} cy={304 + i} r="3.2" fill={C.saffron} />
      ))}
    </g>
  );
}

function Topiary({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 3} y="806" width="6" height="52" fill="#3b2a1e" />
      <circle cx={x} cy="800" r="34" fill={C.leaf} />
      <circle cx={x - 10} cy="788" r="14" fill={C.leafLight} opacity="0.7" />
      <path d={`M${x - 26} 856 H${x + 26} L${x + 20} 900 H${x - 20} Z`} fill="#2A201C" />
      <rect x={x - 28} y="852" width="56" height="6" fill={C.saffron} opacity="0.8" />
    </g>
  );
}

function StoreArt() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const u = (n: string) => `url(#${id}${n})`;

  return (
    <svg className="stage__art" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0F121E" />
          <stop offset="1" stopColor="#262B44" />
        </linearGradient>
        <linearGradient id={`${id}plaster`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#62735E" />
          <stop offset="0.75" stopColor="#8EA185" />
          <stop offset="1" stopColor="#A2B496" />
        </linearGradient>
        <linearGradient id={`${id}lacquer`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#701F25" />
          <stop offset="1" stopColor="#4A1418" />
        </linearGradient>
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F8E2A0" />
          <stop offset="0.45" stopColor="#D99C3C" />
          <stop offset="0.56" stopColor="#B07422" />
          <stop offset="1" stopColor="#F3D387" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="0.5" cy="0.75" r="0.85">
          <stop offset="0" stopColor="#FFDC94" />
          <stop offset="0.55" stopColor="#E59F3E" />
          <stop offset="1" stopColor="#9A501B" />
        </radialGradient>
        <radialGradient id={`${id}glowSoft`} cx="0.5" cy="0.4" r="0.8">
          <stop offset="0" stopColor="#F6C677" />
          <stop offset="1" stopColor="#9C5A22" />
        </radialGradient>
        <linearGradient id={`${id}spill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2B65C" stopOpacity="0.38" />
          <stop offset="1" stopColor="#F2B65C" stopOpacity="0" />
        </linearGradient>
        <pattern id={`${id}louver`} width="46" height="9" patternUnits="userSpaceOnUse">
          <rect y="6" width="46" height="2" fill="#2E3D31" />
        </pattern>
        <pattern id={`${id}brick`} width="44" height="22" patternUnits="userSpaceOnUse">
          <rect width="44" height="22" fill="#2B2331" />
          <path d="M0 11H44M0 22H44M22 0V11M0 11V22M44 11V22" stroke="#211A27" strokeWidth="2" />
        </pattern>
        <mask id={`${id}door`}>
          <rect width="1600" height="1000" fill="#fff" />
          <rect x="690" y="595" width="220" height="305" fill="#000" />
        </mask>
      </defs>

      <g mask={u('door')}>
        {/* sky + moon */}
        <rect width="1600" height="1000" fill={u('sky')} />
        <circle cx="92" cy="70" r="17" fill={C.paper} opacity="0.92" />
        <circle cx="100" cy="64" r="15" fill="#11141F" />

        {/* neighbours */}
        <rect x="0" y="140" width="175" height="760" fill={u('brick')} />
        <rect x="0" y="132" width="180" height="10" fill="#3A3142" />
        <rect x="42" y="200" width="72" height="110" fill="#181520" />
        <rect x="42" y="380" width="72" height="110" fill="#3A3346" />
        <rect x="42" y="560" width="72" height="200" fill="#181520" />
        <rect x="1425" y="200" width="175" height="700" fill="#231D2B" />
        <rect x="1420" y="192" width="180" height="10" fill="#352C3E" />
        <rect x="1480" y="250" width="70" height="110" fill="#1A1622" />
        <rect x="1480" y="420" width="70" height="110" fill="#1A1622" />

        {/* building — upper floor */}
        <rect x="170" y="60" width="1260" height="350" fill={u('plaster')} />
        <rect x="150" y="44" width="1300" height="22" fill="#D7CDB6" />
        <rect x="160" y="66" width="1280" height="8" fill="#55654F" />
        {Array.from({ length: 64 }, (_, i) => (
          <rect key={i} x={168 + i * 20} y="76" width="10" height="9" fill="#C3B99F" />
        ))}
        {UPPER_WINDOWS.map((cx) => (
          <UpperWindow key={cx} cx={cx} lit={cx === 800} id={id} />
        ))}
        <text x="800" y="390" textAnchor="middle" fontFamily="Gloock, serif" fontSize="27" letterSpacing="10" fill={C.paper} opacity="0.22">
          RECORDS · TAPES · HALF-FINISHED IDEAS
        </text>

        {/* shopfront */}
        <rect x="170" y="405" width="1260" height="495" fill={u('lacquer')} />
        <rect x="160" y="400" width="1280" height="14" fill={C.lacquerDark} />
        <rect x="160" y="400" width="1280" height="2" fill="#93403F" />

        {/* fascia sign */}
        <rect x="215" y="424" width="1170" height="104" fill="#17110F" />
        <rect x="223" y="432" width="1154" height="88" fill="none" stroke={u('gold')} strokeWidth="2" />
        <rect x="229" y="438" width="1142" height="76" fill="none" stroke={u('gold')} strokeWidth="0.7" opacity="0.6" />
        <text x="800" y="495" textAnchor="middle" fontFamily="Gloock, serif" fontSize="56" letterSpacing="9" fill={u('gold')}>
          THE LISTENING ROOM
        </text>
        <text x="262" y="481" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="3" fill="#D99C3C">Nº 01</text>
        <text x="1338" y="481" textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="3" fill="#D99C3C">BENGALURU</text>

        {/* pilasters */}
        {[170, 1386].map((x) => (
          <g key={x}>
            <rect x={x} y="528" width="44" height="372" fill="#4A1418" />
            <rect x={x + 6} y="540" width="32" height="348" fill="none" stroke="#7E2A2C" strokeWidth="1.2" />
            <rect x={x - 4} y="528" width="52" height="10" fill="#B07422" opacity="0.8" />
          </g>
        ))}

        {/* display windows */}
        {[232, 960].map((x, w) => (
          <g key={x}>
            <rect x={x} y="548" width="408" height="310" fill={C.lacquerDark} />
            <rect x={x + 8} y="556" width="392" height="294" fill={u('glow')} />
            {/* transom panes */}
            <rect x={x + 8} y="588" width="392" height="5" fill={C.lacquerDark} />
            {[1, 2, 3].map((k) => (
              <rect key={k} x={x + 8 + k * 98 - 2} y="556" width="4" height="32" fill={C.lacquerDark} />
            ))}
            {/* plinth */}
            <rect x={x + 8} y="800" width="392" height="50" fill="#6E3518" />
            <rect x={x + 8} y="800" width="392" height="3" fill="#F2B65C" opacity="0.6" />
            {/* gilded window lettering */}
            <path id={`${id}arc${w}`} d={`M${x + 70} 680 Q${x + 204} 612 ${x + 338} 680`} fill="none" />
            <text fontFamily="Gloock, serif" fontSize="25" letterSpacing="4" fill="#5A1A14" opacity="0.82">
              <textPath href={`#${id}arc${w}`} startOffset="50%" textAnchor="middle">
                {w === 0 ? 'NEW ARRIVALS' : 'PLAYED LOUD'}
              </textPath>
            </text>
            {/* glass reflection */}
            <path d={`M${x + 8} 556 L${x + 140} 556 L${x + 8} 700 Z`} fill="#fff" opacity="0.07" />
            <path d={`M${x + 190} 850 L${x + 400} 610 L${x + 400} 650 L${x + 230} 850 Z`} fill="#fff" opacity="0.05" />
          </g>
        ))}

        {/* left window display: three sleeves and a record */}
        <circle cx="448" cy="742" r="46" fill="#151211" />
        <circle cx="448" cy="742" r="15" fill={C.saffron} />
        <g transform="rotate(-4 315 754)">
          <rect x="268" y="706" width="94" height="94" fill={C.cobalt} />
          <circle cx="315" cy="752" r="28" fill="none" stroke={C.paper} strokeWidth="3" />
          <circle cx="315" cy="752" r="8" fill={C.paper} />
        </g>
        <g transform="rotate(3 505 752)">
          <rect x="458" y="704" width="96" height="96" fill={C.paper} />
          <rect x="458" y="704" width="96" height="40" fill={C.oxblood} />
          <text x="468" y="788" fontFamily="Gloock, serif" fontSize="30" fill={C.ink}>A1</text>
        </g>
        <rect x="372" y="722" width="78" height="78" fill={C.saffron} transform="rotate(-2 411 761)" />
        <path d="M372 800 A39 39 0 0 1 450 800 Z" fill={C.oxblood} transform="rotate(-2 411 761)" />

        {/* right window display: sleeves + a leaning card */}
        {[0, 1, 2, 3].map((k) => (
          <g key={k} transform={`rotate(${[-3, 2, -1, 4][k]} ${1012 + k * 84} 760)`}>
            <rect x={990 + k * 84} y="716" width="76" height="84" fill={['#A9BCA0', C.ink, '#C9B8E8', C.oxblood][k]} />
            <circle cx={1028 + k * 84} cy="752" r={[18, 22, 14, 26][k]} fill={[C.ink, C.saffron, C.cobalt, C.paper][k]} />
          </g>
        ))}
        <g transform="rotate(-4 1170 812)">
          <rect x="1100" y="796" width="140" height="32" fill={C.paper} />
          <text x="1170" y="816" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9.5" letterSpacing="1.4" fill={C.ink}>
            ASK ABOUT THE B-SIDES
          </text>
        </g>

        {/* stall risers */}
        {[232, 960].map((x) => (
          <g key={`r${x}`}>
            <rect x={x} y="858" width="408" height="42" fill="#4A1418" />
            <rect x={x + 12} y="866" width="384" height="26" fill="none" stroke="#7E2A2C" strokeWidth="1.2" />
          </g>
        ))}

        {/* door surround + transom */}
        <rect x="652" y="528" width="38" height="372" fill="#4A1418" />
        <rect x="910" y="528" width="38" height="372" fill="#4A1418" />
        <rect x="652" y="528" width="296" height="20" fill={C.lacquerDark} />
        <rect x="690" y="548" width="220" height="42" fill={u('glow')} />
        <rect x="690" y="590" width="220" height="5" fill={C.lacquerDark} />
        <text x="800" y="578" textAnchor="middle" fontFamily="Gloock, serif" fontSize="22" letterSpacing="3" fill={C.ink} opacity="0.8">
          Nº 1
        </text>

        {/* pavement */}
        <rect x="0" y="900" width="1600" height="100" fill="#2A2421" />
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={i * 124} y1="900" x2={i * 124 - 20} y2="985" stroke="#221D1A" strokeWidth="2" />
        ))}
        <rect x="0" y="984" width="1600" height="16" fill="#3A332E" />
        <path d="M240 900 H632 L712 1000 H160 Z" fill={u('spill')} />
        <path d="M968 900 H1360 L1440 1000 H888 Z" fill={u('spill')} />
        <path d="M690 900 H910 L990 1000 H610 Z" fill={u('spill')} opacity="1.4" />
        <rect x="672" y="898" width="256" height="12" fill="#8D8172" />
        <rect x="672" y="908" width="256" height="3" fill="#5D544A" />

        <Topiary x={612} />
        <Topiary x={988} />
      </g>
    </svg>
  );
}

/** Hanging blade sign — swings gently, separate so it can move. */
function BladeSign() {
  return (
    <svg className="blade" viewBox="0 0 160 200" aria-hidden="true">
      <path d="M0 14 H140 Q154 14 150 28" fill="none" stroke="#17110F" strokeWidth="5" />
      <path d="M8 14 Q40 40 60 14" fill="none" stroke="#17110F" strokeWidth="3" />
      <g className="blade__swing">
        <line x1="62" y1="16" x2="62" y2="46" stroke="#17110F" strokeWidth="2" />
        <line x1="128" y1="16" x2="128" y2="46" stroke="#17110F" strokeWidth="2" />
        <circle cx="95" cy="104" r="58" fill={C.cobalt} stroke="#D99C3C" strokeWidth="3" />
        <circle cx="95" cy="104" r="47" fill="none" stroke={C.cobaltDeep} strokeWidth="2" />
        <circle cx="95" cy="104" r="36" fill="none" stroke={C.cobaltDeep} strokeWidth="2" />
        <circle cx="95" cy="104" r="22" fill={C.saffron} />
        <text x="95" y="111" textAnchor="middle" fontFamily="Gloock, serif" fontSize="19" fill={C.ink}>LR</text>
      </g>
    </svg>
  );
}

export type DoorRefs = { left: HTMLDivElement | null; right: HTMLDivElement | null };

/** The glazed double doors. Frosted glass shows the room behind, blurred. */
export const Doors = forwardRef<HTMLDivElement, { refs: React.MutableRefObject<DoorRefs> }>(function Doors({ refs }, ref) {
  return (
    <div className="doorway" ref={ref}>
      {(['left', 'right'] as const).map((side) => (
        <div
          key={side}
          className={`door door--${side}`}
          ref={(el) => {
            refs.current[side] = el;
          }}
        >
          <div className="door__glass">
            {side === 'left' && (
              <div className="door__sign">
                <span className="door__sign-open">{exterior.doorSign[0]}</span>
                <span className="door__sign-note">{exterior.doorSign[1]}</span>
              </div>
            )}
          </div>
          <div className="door__kick" />
          <span className="door__handle" />
        </div>
      ))}
    </div>
  );
});

export function StoreExterior({ doorsRef, doorRefs }: { doorsRef: React.Ref<HTMLDivElement>; doorRefs: React.MutableRefObject<DoorRefs> }) {
  return (
    <>
      <StoreArt />
      <BladeSign />
      <Doors ref={doorsRef} refs={doorRefs} />
    </>
  );
}
