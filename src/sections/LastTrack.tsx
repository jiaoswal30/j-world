import { useRef, useState } from 'react';
import { lastTrack, person, tracks } from '../content/site';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { prefersReducedMotion, scrollToTarget } from '../lib/scroll';
import { useReveal } from '../lib/useReveal';
import { Vinyl } from '../components/Vinyl';

const track = tracks.find((t) => t.id === 'contact')!;

/**
 * The closing interaction: the record is stuck in its run-out groove and will
 * keep turning until you lift the needle — which takes you back to the street.
 */
function RunOut() {
  const ref = useRef<HTMLDivElement>(null);
  const spin = useRef<gsap.core.Tween | null>(null);
  const [lifted, setLifted] = useState(false);

  useGSAP(
    () => {
      spin.current = gsap.to('.vinyl__disc', { rotation: '+=360', duration: 1.8, ease: 'none', repeat: -1, paused: true });
      gsap.set('.runout__arm', { rotation: 34 });
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive && !prefersReducedMotion() ? spin.current?.play() : spin.current?.pause()),
      });
      return () => st.kill();
    },
    { scope: ref },
  );

  const lift = () => {
    if (lifted) return;
    setLifted(true);
    const reset = () => {
      gsap.set('.runout__arm', { rotation: 34 });
      if (spin.current) spin.current.timeScale(1);
      setLifted(false);
    };
    if (prefersReducedMotion()) {
      scrollToTarget(0, { onComplete: reset });
      return;
    }
    gsap
      .timeline()
      .to(ref.current!.querySelector('.runout__arm'), { rotation: 0, duration: 0.7, ease: 'power2.inOut' })
      .to(spin.current, { timeScale: 0, duration: 1.1, ease: 'power2.out' }, 0.2)
      .add(() => scrollToTarget(0, { duration: 3.4, onComplete: reset }), 0.9);
  };

  return (
    <div className="runout" ref={ref}>
      <div className="runout__deck">
        <div className="runout__record">
          <Vinyl label="#EFE7D6" ink="#5E1A1F" code="B5" title="Run-out groove" />
        </div>
        <div className="runout__arm" aria-hidden="true">
          <span className="runout__rod" />
          <span className="runout__head" />
          <span className="runout__base" />
        </div>
      </div>
      <p className="runout__note">
        <span className="mono">You've reached the run-out groove.</span>
        <span>It'll keep turning until you lift the needle.</span>
      </p>
      <button type="button" className="runout__lift" onClick={lift} disabled={lifted}>
        <span className="mono">{lifted ? 'Rewinding to the street…' : 'Lift the needle'}</span>
        <span aria-hidden="true">↑</span>
      </button>
    </div>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(person.email);
      ok = true;
    } catch {
      // clipboard API blocked (permissions, older Safari): fall back to a hidden selection
      const ta = document.createElement('textarea');
      ta.value = person.email;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      ok = document.execCommand('copy');
      ta.remove();
    }
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="contact" data-rise>
      <p className="mono contact__head">Book a listening session</p>
      <ul className="contact__list">
        <li>
          <span className="mono">Email</span>
          {person.email ? (
            <span className="contact__row">
              <a href={`mailto:${person.email}`}>{person.email}</a>
              <button type="button" className="contact__copy mono" onClick={copy}>
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </span>
          ) : (
            <mark className="tbc">add your email in src/content/site.ts</mark>
          )}
        </li>
        <li>
          <span className="mono">LinkedIn</span>
          {person.linkedin ? (
            <a className="say-hi" href={person.linkedin} target="_blank" rel="noreferrer">
              <span className="say-hi__disc" aria-hidden="true" />
              <span className="say-hi__text">
                come say hi — <em>I reply faster than I finish playlists</em>
              </span>
              <span className="say-hi__arrow" aria-hidden="true">
                ↗
              </span>
              <svg className="say-hi__squiggle" viewBox="0 0 300 10" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 6 Q 20 1 38 6 T 74 6 T 110 6 T 146 6 T 182 6 T 218 6 T 254 6 T 298 6" />
              </svg>
            </a>
          ) : (
            <mark className="tbc">add your LinkedIn URL in src/content/site.ts</mark>
          )}
        </li>
        <li>
          <span className="mono">Based in</span>
          <span>{person.city}</span>
        </li>
      </ul>
    </div>
  );
}

/** B5 — The Last Track. Why me, said plainly, then the needle comes up. */
export function LastTrack() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="section last on-dark" id="contact" ref={ref}>
      <p className="mono last__kicker">
        <span>{track.code}</span>
        <span>{lastTrack.kicker}</span>
        <span>{track.title}</span>
      </p>
      <h2 className="last__statement" data-split>
        {lastTrack.statement}
      </h2>

      <div className="last__grid">
        <div className="last__copy">
          {lastTrack.body.map((p, i) => (
            <p key={i} data-rise>
              {p}
            </p>
          ))}

          <div className="bring" data-rise>
            <p className="mono bring__head">What I'm bringing</p>
            <ol className="bring__list">
              {lastTrack.bring.map((b, i) => (
                <li key={b}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  {b}
                </li>
              ))}
            </ol>
            <p className="bring__not">
              <span className="mono">Not bringing</span> {lastTrack.notBringing}
            </p>
          </div>

          <Contact />
        </div>

        <RunOut />
      </div>

      <footer className="credits">
        <dl className="credits__list">
          {lastTrack.credits.map((c) => (
            <div key={c.role}>
              <dt className="mono">{c.role}</dt>
              <dd>{c.who}</dd>
            </div>
          ))}
        </dl>
        <div className="credits__end">
          <span className="mono">© {new Date().getFullYear()} {person.name} · The Listening Room</span>
          <button type="button" className="mono credits__top" onClick={() => scrollToTarget(0, { duration: 2.6 })}>
            Back to the street ↑
          </button>
        </div>
      </footer>
    </section>
  );
}
