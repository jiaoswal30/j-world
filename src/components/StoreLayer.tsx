import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/scroll';
import type { Track } from '../content/site';
import type { DeckState, Store3D } from './Store3D';
import { RoomArt } from './ListeningRoom';
import { Turntable, ARM_PLAYING, type TurntableHandle } from './Turntable';

export type StoreHandle = TurntableHandle & {
  setProgress: (p: number) => void;
  setActive: (on: boolean) => void;
};

const HOUSE = { label: '#2335C8', labelInk: '#EFE7D6', code: 'TLR', title: 'House record' };

/**
 * The record store, in 3D (three.js). Falls back to the illustrated room if WebGL
 * isn't available. Either way it exposes the same turntable handle to the scene.
 */
export const StoreLayer = forwardRef<StoreHandle | null, { now: Track | null }>(function StoreLayer({ now }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const platter = useRef<HTMLDivElement>(null);
  const store = useRef<Store3D | null>(null);
  const fallback = useRef<TurntableHandle | null>(null);
  const [failed, setFailed] = useState(false);
  const deck = useRef<DeckState>({ arm: { rotation: ARM_PLAYING }, record: { autoAlpha: 1 }, spin: { rot: 0 } });
  const spin = useRef<gsap.core.Tween>(gsap.to(deck.current.spin, { rot: '+=360', duration: 1.8, ease: 'none', repeat: -1, paused: true }));
  const progress = useRef(0);

  useEffect(() => {
    let s: Store3D | null = null;
    let cancelled = false;
    const resize = () => s?.resize(window.innerWidth, window.innerHeight);
    import('./Store3D')
      .then(async ({ Store3D: S }) => {
        if (cancelled) return;
        s = new S(canvas.current!, platter.current!, deck.current);
        store.current = s;
        resize();
        window.addEventListener('resize', resize);
        await s.build();
        if (cancelled) return;
        s.setProgress(prefersReducedMotion() ? 1 : progress.current);
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      window.removeEventListener('resize', resize);
      s?.dispose();
      store.current = null;
    };
  }, []);

  useEffect(() => {
    const t = now ?? HOUSE;
    store.current?.setLabel(t.label, t.labelInk, t.code, t.title);
  }, [now]);

  useEffect(() => () => void spin.current.kill(), []);

  useImperativeHandle(ref, () => ({
    get platter() {
      return failed && fallback.current ? fallback.current.platter : platter.current!;
    },
    get record() {
      return failed && fallback.current ? fallback.current.record : deck.current.record;
    },
    get arm() {
      return failed && fallback.current ? fallback.current.arm : deck.current.arm;
    },
    get spin() {
      return failed && fallback.current ? fallback.current.spin : spin.current;
    },
    setProgress(p: number) {
      progress.current = p;
      store.current?.setProgress(p);
    },
    setActive(on: boolean) {
      if (on) store.current?.start();
      else store.current?.stop();
    },
  }));

  if (failed) {
    return (
      <div className="stage">
        <RoomArt />
        <Turntable ref={fallback} now={now} />
      </div>
    );
  }

  return (
    <>
      <canvas className="store3d" ref={canvas} aria-label="A 3D record store at night in Bengaluru" role="img" />
      <div className="store3d__platter" ref={platter} aria-hidden="true" />
    </>
  );
});
