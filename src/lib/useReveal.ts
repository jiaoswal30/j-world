import type { RefObject } from 'react';
import { gsap, SplitText, useGSAP } from './gsap';

/**
 * Two reveals, used sparingly across every section:
 *  [data-split] — headline lines rise out of a mask
 *  [data-rise]  — a block eases up into place
 * Both play once; scrolling back never leaves anything hidden.
 */
export function useReveal(scope: RefObject<HTMLElement>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = scope.current!;
        root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.15,
                stagger: 0.09,
                ease: 'power4.out',
                scrollTrigger: { trigger: el, start: 'top 86%', once: true },
              });
            },
          });
        });
        gsap.utils.toArray<HTMLElement>('[data-rise]', root).forEach((el) => {
          gsap.from(el, {
            y: 34,
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });
      });
    },
    { scope },
  );
}
