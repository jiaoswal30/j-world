import { useRef } from 'react';
import { about, tracks } from '../content/site';
import { rich } from '../lib/rich';
import { useReveal } from '../lib/useReveal';
import { SectionHead } from '../components/SectionHead';
import { StarCut } from '../components/StarCut';

const track = tracks.find((t) => t.id === 'about')!;

/** A1 — The Person. Liner-note layout; interests filed like record-bin dividers. */
export function About() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="section about" id="about" ref={ref} tabIndex={-1}>
      <SectionHead track={track} kicker={about.kicker} />

      <div className="about__grid">
        <div className="about__copy">
          <p className="about__lede" data-rise>
            {rich(about.lede)}
          </p>
          <div className="about__body" data-rise>
            {about.body.map((p, i) => (
              <p key={i}>{rich(p)}</p>
            ))}
          </div>
        </div>

        <StarCut src={about.portrait.src} alt={about.portrait.alt} />
      </div>

      <div className="dividers" data-rise>
        <p className="mono dividers__head">Currently filed under</p>
        <ul className="dividers__list">
          {about.filedUnder.map((f, i) => (
            <li key={f} className="divider" style={{ '--i': i } as React.CSSProperties}>
              <span className="divider__tab">{f}</span>
            </li>
          ))}
        </ul>
        <p className="dividers__note hand">{about.filedNote}</p>
      </div>
    </section>
  );
}
