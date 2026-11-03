import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import india from '@svg-maps/india';
import type { Globe } from './Globe';
import { journey } from '../content/site';
import { jazz, useJazz } from '../lib/jazz';
import { prefersReducedMotion } from '../lib/scroll';
import { asset } from '../lib/asset';

export type JourneyHandle = {
  root: HTMLDivElement;
  globe: Globe | null;
  title: HTMLDivElement;
  fog: HTMLDivElement;
  map: HTMLDivElement;
  zoom: SVGGElement;
  karnataka: SVGPathElement;
  states: SVGPathElement[];
  labels: HTMLDivElement;
  captions: HTMLLIElement[];
  /** SVG-space focus points for the camera moves */
  focus: { karnataka: { x: number; y: number; s: number }; bengaluru: { x: number; y: number; s: number } };
};

const VB = { w: 612, h: 696 };

/** Small 4-point sparkle, the star from the edit references. */
export function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg className={`sparkle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0 Z" />
    </svg>
  );
}

function TitleCard() {
  const playing = useJazz();
  return (
    <div className="tcard">
      <span className="tcard__ticks tcard__ticks--l" aria-hidden="true" />
      <span className="tcard__ticks tcard__ticks--r" aria-hidden="true" />
      <p className="tcard__corner tcard__corner--tl">
        a portfolio
        <br />
        by jia oswal
      </p>
      <p className="tcard__corner tcard__corner--tr">
        vol. 01
        <br />
        bengaluru, in
      </p>

      <div className="tcard__center">
        <p className="tcard__heading mono">{journey.heading}</p>
        <h1 className="tcard__word">
          <span className="tcard__word-main">{journey.word}</span>
          <span className="tcard__word-ghost" aria-hidden="true">
            {journey.word}
          </span>
        </h1>
        <p className="tcard__sub">{journey.sub}</p>
        <button type="button" className="tcard__sound mono" onClick={() => (playing ? jazz.stop() : jazz.start())} aria-pressed={playing}>
          <span className="tcard__sound-disc" aria-hidden="true" />
          {playing ? 'Lift the needle' : 'Put the record on — sound on'}
        </button>
      </div>

      <ul className="tcard__repeat" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>jia's world</li>
        ))}
      </ul>
      <span className="tcard__dot tcard__dot--a" aria-hidden="true" />
      <span className="tcard__dot tcard__dot--b" aria-hidden="true" />
      <span className="tcard__dot tcard__dot--c" aria-hidden="true" />
      <span className="tcard__dot tcard__dot--d" aria-hidden="true" />
      <Sparkle className="tcard__spark tcard__spark--a" />
      <Sparkle className="tcard__spark tcard__spark--b" />

      <div className="tcard__scroll mono">
        <span>Scroll to begin the story</span>
        <span className="tcard__scroll-line" aria-hidden="true" />
      </div>
    </div>
  );
}

/**
 * Prologue: Earth → clouds → India → Karnataka → Bengaluru.
 * All motion is driven from the Arrival timeline; this component only owns the pieces.
 */
export const Journey = forwardRef<JourneyHandle | null>(function Journey(_, ref) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const fog = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const zoom = useRef<SVGGElement>(null);
  const karnataka = useRef<SVGPathElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const globe = useRef<Globe | null>(null);
  const focus = useRef<JourneyHandle['focus']>({ karnataka: { x: 0, y: 0, s: 1 }, bengaluru: { x: 0, y: 0, s: 1 } });
  const [noGl, setNoGl] = useState(false);

  useEffect(() => {
    let g: Globe | null = null;
    let cancelled = false;
    const resize = () => g?.resize(window.innerWidth, window.innerHeight);
    const onVis = () => {
      if (!g) return;
      if (document.hidden) g.stop();
      else if (window.scrollY < window.innerHeight * 3 && !prefersReducedMotion()) g.start();
    };
    // three.js loads in its own chunk so the page shell paints first
    import('./Globe')
      .then(({ Globe: G }) => {
        if (cancelled) return;
        g = new G(canvas.current!);
        globe.current = g;
        resize();
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', onVis);
        return g.load().then(() => {
          // idle spin while the visitor is still on the opening frame
          if (!cancelled && !prefersReducedMotion() && window.scrollY < window.innerHeight * 3) g!.start();
        });
      })
      .catch(() => setNoGl(true));
    return () => {
      cancelled = true;
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      g?.dispose();
      globe.current = null;
    };
  }, []);

  // Where Karnataka and Bengaluru sit in the map's own coordinates.
  // Layout effect: must be ready before the parent builds its timeline.
  useLayoutEffect(() => {
    const k = karnataka.current!;
    const b = k.getBBox();
    // Karnataka spans ≈ 74.05–78.59°E, 11.58–18.45°N; Bengaluru is 77.59°E, 12.97°N.
    const bx = b.x + b.width * ((77.59 - 74.05) / (78.59 - 74.05));
    const by = b.y + b.height * ((18.45 - 12.97) / (18.45 - 11.58));
    const fit = Math.min(VB.w / b.width, VB.h / b.height) * 0.62;
    focus.current = {
      karnataka: { x: b.x + b.width / 2, y: b.y + b.height / 2, s: fit },
      bengaluru: { x: bx, y: by, s: fit * 4.2 },
    };
  }, []);

  useImperativeHandle(ref, () => ({
    get root() {
      return root.current!;
    },
    get globe() {
      return globe.current;
    },
    get title() {
      return title.current!;
    },
    get fog() {
      return fog.current!;
    },
    get map() {
      return map.current!;
    },
    get zoom() {
      return zoom.current!;
    },
    get karnataka() {
      return karnataka.current!;
    },
    get states() {
      return Array.from(zoom.current!.querySelectorAll<SVGPathElement>('.state'));
    },
    get labels() {
      return labels.current!;
    },
    get captions() {
      return Array.from(root.current!.querySelectorAll<HTMLLIElement>('.caption'));
    },
    get focus() {
      return focus.current;
    },
  }));

  return (
    <div className="journey" ref={root}>
      <canvas className="journey__canvas" ref={canvas} aria-hidden="true" />
      {noGl && <div className="journey__fallback" aria-hidden="true" style={{ backgroundImage: `url(${asset('/earth/earth_atmos_2048.jpg')})` }} />}

      <div className="journey__fog" ref={fog} aria-hidden="true" />

      <div className="journey__map" ref={map} aria-hidden="true">
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="graticule" width="34" height="34" patternUnits="userSpaceOnUse">
              <path d="M34 0H0V34" fill="none" stroke="rgba(239,231,214,.06)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect x="-2000" y="-2000" width="5000" height="5000" fill="url(#graticule)" />
          <g ref={zoom}>
            {india.locations.map((l) => (
              <path
                key={l.id}
                ref={l.id === 'ka' ? karnataka : undefined}
                className={`state ${l.id === 'ka' ? 'state--ka' : ''}`}
                d={l.path}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        </svg>
        <div className="map-labels" ref={labels}>
          <p className="map-label map-label--india">
            <span className="mono">Republic of</span>
            <span className="script">India</span>
          </p>
          <p className="map-label map-label--ka">
            <span className="mono">State</span>
            <span className="script">Karnataka</span>
          </p>
          <div className="map-pin">
            <span className="map-pin__ring" />
            <span className="map-pin__dot" />
          </div>
          <p className="map-label map-label--blr">
            <span className="script">Bengaluru</span>
            <span className="mono">12.9716° N · 77.5946° E</span>
          </p>
        </div>
      </div>

      <div className="journey__title" ref={title}>
        <TitleCard />
      </div>

      <ol className="captions">
        {journey.captions.map((c, i) => (
          <li key={i} className="caption">
            <span className="mono caption__n">{String(i + 1).padStart(2, '0')} / {String(journey.captions.length).padStart(2, '0')}</span>
            <span className="caption__text">{c}</span>
          </li>
        ))}
      </ol>
    </div>
  );
});
