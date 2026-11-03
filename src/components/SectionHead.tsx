import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { rich } from '../lib/rich';
import { Vinyl } from './Vinyl';
import type { Track } from '../content/site';

/**
 * Every track opens with its record label. The disc turns as you scroll past it —
 * the same object as the room, so the sections feel like the room continuing.
 */
export function SectionHead({ track, kicker, intro }: { track: Track; kicker: string; intro?: string }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.vinyl__disc',
          { rotation: -40 },
          { rotation: 220, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <header className="shead" ref={ref}>
      {track.ghost && (
        <span className="shead__ghost" aria-hidden="true">
          {track.ghost}
        </span>
      )}
      <div className="shead__disc" aria-hidden="true">
        <Vinyl label={track.label} ink={track.labelInk} code={track.code} title={track.title} />
      </div>
      <div className="shead__text">
        <p className="mono shead__kicker">
          <span>{track.code}</span>
          <span>{kicker}</span>
          <span>33⅓ rpm</span>
        </p>
        <h2 className="shead__title" data-split>
          {track.title}
        </h2>
        {intro && (
          <p className="shead__intro" data-rise>
            {rich(intro)}
          </p>
        )}
      </div>
    </header>
  );
}
