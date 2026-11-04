import { useRef } from 'react';
import { note } from '../content/site';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/scroll';
import { useReveal } from '../lib/useReveal';
import { SignalField } from '../components/SignalField';

const NOISE = '01/<>#*+=-_';

/** Decode a headline out of noise (on scroll-in, and again on hover). */
function decode(el: HTMLElement, duration = 1.1) {
  const text = el.dataset.text ?? el.textContent ?? '';
  el.dataset.text = text;
  gsap.to(el, { duration, scrambleText: { text, chars: NOISE, speed: 0.6, revealDelay: 0.15 }, ease: 'none', overwrite: true });
}

/** B4 — Signal, from noise. Field notes on what I'm working out, by building. */
export function Editorial() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>('.ticket').forEach((t) => {
        const h = t.querySelector<HTMLElement>('.ticket__head')!;
        gsap.from(t, {
          y: 40,
          opacity: 0, // opacity only: hidden-by-visibility content would be unreachable by keyboard
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: t, start: 'top 88%', once: true, onEnter: () => decode(h, 1.4) },
        });
      });
    },
    { scope: ref },
  );

  const rescramble = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    const h = e.currentTarget.querySelector<HTMLElement>('.ticket__head');
    if (h) decode(h, 0.7);
  };

  return (
    <section className="section signal" id="note" ref={ref}>
      <header className="signal__head">
        <p className="mono signal__kicker">
          <span>{note.kicker}</span>
          <span>Status ▸ shipping</span>
          <span>12.97° N · 77.59° E</span>
        </p>
        <h2 className="signal__title" data-split>
          {note.title}
        </h2>
        <p className="signal__intro" data-rise>
          {note.intro}
        </p>
      </header>

      <SignalField word={note.word} stream={note.stream} />

      <ol className="tickets">
        {note.parts.map((p, i) => (
          <li key={p.head} className="ticket" onMouseEnter={rescramble} style={{ '--r': `${[-0.6, 0.5, -0.3, 0.7, -0.5][i % 5]}deg` } as React.CSSProperties}>
            <div className="ticket__stub" aria-hidden="true">
              <span className="mono">File</span>
              <span className="ticket__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="mono ticket__of">/ {String(note.parts.length).padStart(2, '0')}</span>
            </div>
            <div className="ticket__body">
              <p className="mono ticket__meta">
                <span>{p.tag}</span>
                <span className="ticket__status">Shipping</span>
              </p>
              <h3 className="ticket__head">{p.head}</h3>
              <p className="ticket__text">{p.body}</p>
              <div className="ticket__foot" aria-hidden="true">
                <span className="mono">JO-B4-{String(i + 1).padStart(2, '0')} · BLR</span>
                <span className="ticket__barcode" />
              </div>
            </div>
          </li>
        ))}
        {note.parts
          .filter((p) => 'pull' in p && p.pull)
          .map((p) => (
            <li key="pull" className="sticker" aria-label="Pull quote">
              <span className="mono sticker__label">Rule Nº 1</span>
              <span className="sticker__text">{'pull' in p ? p.pull : ''}</span>
            </li>
          ))}
      </ol>

      <p className="signal__signoff hand">{note.signoff}</p>
    </section>
  );
}
