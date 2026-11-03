import { useRef } from 'react';
import { receipts, tracks } from '../content/site';
import { rich } from '../lib/rich';
import { gsap, useGSAP } from '../lib/gsap';
import { useReveal } from '../lib/useReveal';
import { SectionHead } from '../components/SectionHead';

const track = tracks.find((t) => t.id === 'milestones')!;

/** A2 — The Receipts. Evidence, printed. The receipt feeds out of the printer once. */
export function Receipts() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ scrollTrigger: { trigger: '.receipt', start: 'top 78%', once: true } })
          .fromTo('.receipt', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'power2.inOut' })
          .fromTo('.stamp', { scale: 1.8, autoAlpha: 0, rotation: -30 }, { scale: 1, autoAlpha: 1, rotation: -12, duration: 0.35, ease: 'back.out(2.2)' }, '-=0.2');
        gsap.from('.milestone', {
          y: 30,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 0.9,
          scrollTrigger: { trigger: '.milestones', start: 'top 85%', once: true },
        });
      });
    },
    { scope: ref },
  );

  const r = receipts.receipt;

  return (
    <section className="section receipts on-dark" id="milestones" ref={ref}>
      <SectionHead track={track} kicker={receipts.kicker} intro={receipts.intro} />

      <div className="receipts__grid">
        <div className="receipt-wrap">
          <article className="receipt" aria-label={`${r.store} — outcomes`}>
            <p className="receipt__store">{r.store}</p>
            <p className="mono receipt__sub">Field receipt · Nº 0001</p>
            <dl className="receipt__meta">
              <div>
                <dt>Role</dt>
                <dd>{rich(r.role)}</dd>
              </div>
              <div>
                <dt>Period</dt>
                <dd>{rich(r.period)}</dd>
              </div>
            </dl>
            <ul className="receipt__lines">
              {r.lines.map((l) => (
                <li key={l.label}>
                  <span>{l.label}</span>
                  <span className="receipt__dots" aria-hidden="true" />
                  <strong>{l.value}</strong>
                </li>
              ))}
            </ul>
            <p className="receipt__total">
              <span>Total</span>
              <span className="receipt__dots" aria-hidden="true" />
              <strong>Showed up</strong>
            </p>
            <p className="receipt__context">{rich(r.context)}</p>
            <div className="receipt__barcode" aria-hidden="true" />
            <p className="mono receipt__thanks">Thank you for reading · Keep this receipt</p>
            <div className="stamp" aria-hidden="true">
              <span>On the</span>
              <strong>Record</strong>
            </div>
          </article>
        </div>

        <ol className="numerals">
          {receipts.numerals.map((n) => (
            <li key={n.label} className="numeral" data-rise>
              <span className="numeral__value">{n.value}</span>
              <span className="numeral__label mono">{n.label}</span>
              <span className="numeral__note hand">{n.note}</span>
            </li>
          ))}
          <li className="numeral__source mono" data-rise>
            Source: {r.store}. Numbers as reported, not rounded up.
          </li>
        </ol>
      </div>

      <div className="milestones">
        <p className="mono milestones__head">The archive</p>
        <ol className="milestones__list">
          {receipts.timeline.map((m) => (
            <li key={m.what} className="milestone">
              <span className="milestone__when mono">{rich(m.when)}</span>
              <span className="milestone__what">{m.what}</span>
              <span className="milestone__detail">{m.detail}</span>
            </li>
          ))}
        </ol>
        {receipts.awards.length > 0 && (
          <ul className="awards">
            {receipts.awards.map((a) => (
              <li key={a.title}>
                <strong>{a.title}</strong> — {a.by}, {a.year}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
