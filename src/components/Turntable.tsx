import { forwardRef, useImperativeHandle, useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { Vinyl } from './Vinyl';
import type { Track } from '../content/site';

export type TurntableHandle = {
  platter: HTMLDivElement;
  record: HTMLDivElement;
  arm: HTMLDivElement;
  spin: gsap.core.Tween;
};

export const ARM_PLAYING = 30;

const HOUSE = { label: '#2335C8', ink: '#EFE7D6', code: 'TLR', title: 'House record' };

/**
 * The deck is a real plane tilted in CSS 3D, so the record on it spins
 * as a properly foreshortened disc rather than a faked ellipse.
 */
export const Turntable = forwardRef<TurntableHandle | null, { now: Track | null }>(function Turntable({ now }, ref) {
  const platter = useRef<HTMLDivElement>(null);
  const record = useRef<HTMLDivElement>(null);
  const arm = useRef<HTMLDivElement>(null);
  const spin = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    const disc = record.current!.querySelector('.vinyl__disc');
    spin.current = gsap.to(disc, { rotation: '+=360', duration: 1.8, ease: 'none', repeat: -1, paused: true });
    gsap.set(arm.current, { rotation: ARM_PLAYING });
  });

  useImperativeHandle(ref, () => ({
    get platter() {
      return platter.current!;
    },
    get record() {
      return record.current!;
    },
    get arm() {
      return arm.current!;
    },
    get spin() {
      return spin.current!;
    },
  }));

  const v = now ? { label: now.label, ink: now.labelInk, code: now.code, title: now.title } : HOUSE;

  return (
    <div className="tt">
      <div className="tt__deckwrap">
        <div className="tt__deck">
          <div className="tt__platter" ref={platter}>
            <div className="tt__record" ref={record}>
              <Vinyl label={v.label} ink={v.ink} code={v.code} title={v.title} />
            </div>
          </div>
          <div className="tt__arm" ref={arm}>
            <span className="tt__arm-rod" />
            <span className="tt__arm-head" />
            <span className="tt__arm-base" />
          </div>
          <span className="tt__knob" />
          <span className="tt__knob tt__knob--b" />
        </div>
      </div>
      <div className="tt__front">
        <span className="tt__led" />
        <span className="tt__speed">33⅓ · 45</span>
        <span className="tt__brand">{now ? `Now playing ${now.code}` : 'TLR — 01'}</span>
      </div>
    </div>
  );
});
