import { useRef } from 'react';
import { gallery, tracks } from '../content/site';
import { gsap, useGSAP } from '../lib/gsap';
import { useReveal } from '../lib/useReveal';
import { SectionHead } from '../components/SectionHead';
import { Plate } from '../components/Plate';

const track = tracks.find((t) => t.id === 'gallery')!;

/**
 * B3 — The Crates, as a run of file dividers (the "social media designs" edit).
 * Each divider shows a slice of the work; hover or focus pulls the folder open
 * to the image's full, uncropped proportions.
 */
export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.folder', {
          yPercent: 18,
          opacity: 0, // opacity only: hidden-by-visibility content would be unreachable by keyboard
          stagger: 0.08,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.folders', start: 'top 80%', once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section className="section gallery" id="gallery" ref={ref}>
      <SectionHead track={track} kicker="Side B · Track 3" intro="Printed things, pinned things, things in production. Pull a folder open to see the whole piece." />

      <div className="folders" data-lenis-prevent-horizontal>
        <div className="folders__cover" aria-hidden="true">
          <span className="folders__brand">jia</span>
          <span className="folders__title">
            visual <em>edits</em>
          </span>
        </div>

        {gallery.map((g, i) => (
          <figure
            key={i}
            className="folder"
            tabIndex={0}
            style={{ '--i': i, '--ratio': g.ratio } as React.CSSProperties}
            aria-label={`${g.title} — ${g.caption}`}
          >
            <div className="folder__divider" aria-hidden="true">
              <span className="folder__tab">
                <span className="folder__label">{g.caption.toLowerCase()}</span>
              </span>
            </div>
            <div className="folder__img">
              <Plate src={g.src} art={g.art} alt={g.alt} ratio={g.ratio} tone={g.tone} label={g.title} />
            </div>
            <figcaption className="folder__cap mono">
              Nº {String(i + 1).padStart(2, '0')} · {g.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
