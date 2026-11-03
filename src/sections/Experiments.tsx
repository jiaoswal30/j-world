import { useRef } from 'react';
import { experiments, tracks, type Experiment } from '../content/site';
import { Draggable, InertiaPlugin, useGSAP } from '../lib/gsap';
import { useReveal } from '../lib/useReveal';
import { SectionHead } from '../components/SectionHead';
import { Vinyl } from '../components/Vinyl';

const track = tracks.find((t) => t.id === 'experiments')!;

/** A record you can actually spin. Drag, throw, watch the rpm. */
function ScratchRecord() {
  const wrap = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = disc.current!;
      InertiaPlugin.track(el, 'rotation');
      let last = '';
      const update = () => {
        const rpm = Math.abs(InertiaPlugin.getVelocity(el, 'rotation') / 6);
        const text = rpm < 1 ? '0' : rpm.toFixed(0);
        if (text !== last && readout.current) readout.current.textContent = (last = text);
      };
      const [d] = Draggable.create(el, {
        type: 'rotation',
        inertia: true,
        onDrag: update,
        onThrowUpdate: update,
        onThrowComplete: update,
        onPress: () => wrap.current?.classList.add('is-touched'),
      });
      return () => {
        d.kill();
        InertiaPlugin.untrack(el);
      };
    },
    { scope: wrap },
  );

  return (
    <div className="scratch" ref={wrap}>
      <div className="scratch__disc" ref={disc} aria-label="A record you can spin with your mouse or finger" role="img">
        <Vinyl label="#E0A43A" ink="#1C1512" code="B2" title="Spin me" />
      </div>
      <p className="scratch__readout">
        <span className="mono">Currently</span>
        <span>
          <span ref={readout}>0</span> rpm
        </span>
        <span className="hand scratch__hint">33⅓ is the polite speed →</span>
      </p>
    </div>
  );
}

function Card({ e, i }: { e: Experiment; i: number }) {
  return (
    <article className={`card ${e.live ? 'card--live' : ''}`} style={{ '--r': `${[-1.6, 1.2, -0.6, 2, -2.2, 0.8, -1, 1.6][i % 8]}deg` } as React.CSSProperties} data-rise>
      <span className="card__pin" aria-hidden="true" />
      <p className="mono card__filed">Filed under — {e.filed}</p>
      <h3 className="card__q">{e.question}</h3>
      <p className="card__note">{e.note}</p>
      {e.live && <ScratchRecord />}
      <span className={`card__stamp card__stamp--${e.status.replace(/\s/g, '-')}`}>{e.status}</span>
    </article>
  );
}

/** B2 — The Experiments. Questions pinned to a pegboard, not skills in a list. */
export function Experiments() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="section experiments on-dark" id="experiments" ref={ref}>
      <SectionHead
        track={track}
        kicker="Side B · Track 2"
        intro="Not a list of software. A list of questions I'm currently carrying around — and how far into each one I've got."
      />
      <div className="pegboard">
        {experiments.map((e, i) => (
          <Card key={e.question} e={e} i={i} />
        ))}
      </div>
    </section>
  );
}

