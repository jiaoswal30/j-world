import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll positions other components need to jump to (set by the scenes that own them). */
export const marks: { store: number; room: number } = { store: 0, room: 0 };

const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

export function initScroll() {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

type Target = string | number | HTMLElement;

export function scrollToTarget(
  target: Target,
  opts: { duration?: number; offset?: number; onComplete?: () => void } = {},
) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: opts.duration ?? 1.6,
      offset: opts.offset ?? 0,
      easing: easeInOutQuart,
      onComplete: opts.onComplete,
    });
    return;
  }
  let top = 0;
  if (typeof target === 'number') top = target;
  else {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY;
  }
  window.scrollTo({ top: top + (opts.offset ?? 0), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  opts.onComplete?.();
}

export function lockScroll() {
  lenis?.stop();
  document.documentElement.classList.add('is-locked');
}

export function unlockScroll() {
  lenis?.start();
  document.documentElement.classList.remove('is-locked');
}
