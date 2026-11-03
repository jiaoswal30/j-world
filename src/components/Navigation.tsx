import { useEffect, useRef, useState } from 'react';
import { person, tracks } from '../content/site';
import { ScrollTrigger, gsap, useGSAP } from '../lib/gsap';
import { marks, scrollToTarget } from '../lib/scroll';
import { SoundToggle } from './Crackle';

const WORLD = { code: '✦', title: "Jia's World" };
const OUTSIDE = { code: '—', title: 'Outside the shop' };
const ROOM = { code: '◉', title: 'In the room' };

/** Reading time, honestly computed from the words actually on the page. */
function readTime(id: string) {
  const el = document.getElementById(id);
  if (!el) return '';
  // textContent, not innerText: sections not yet revealed are visibility:hidden, which innerText skips
  const words = (el.textContent || '').trim().split(/\s+/).length;
  const secs = Math.max(20, Math.round((words / 230) * 60));
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
}

/**
 * Navigation as the back of the sleeve: a tracklist you can jump into,
 * a "now playing" line, and a progress groove along the top.
 */
export function Navigation() {
  const bar = useRef<HTMLSpanElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(WORLD);
  const [times, setTimes] = useState<Record<string, string>>({});

  useGSAP(() => {
    const sections = tracks.map((t) => ({ t, el: document.getElementById(t.id) }));
    let current = '';
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        gsap.set(bar.current, { scaleX: self.progress });
        const y = self.scroll();
        const mid = window.innerHeight * 0.5;
        let next = y < marks.store ? WORLD : y < marks.store + (marks.room - marks.store) * 0.62 ? OUTSIDE : ROOM;
        for (const s of sections) {
          if (s.el && s.el.getBoundingClientRect().top < mid) next = { code: s.t.code, title: s.t.title };
        }
        if (next.title !== current) {
          current = next.title;
          setNow(next);
        }
      },
    });
  });

  useEffect(() => {
    if (!open) return;
    setTimes(Object.fromEntries(tracks.map((t) => [t.id, readTime(t.id)])));
    panel.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (target: string | number) => {
    setOpen(false);
    toggle.current?.focus({ preventScroll: true });
    scrollToTarget(target, { duration: 2 });
  };

  return (
    <>
      <header className="nav">
        <button type="button" className="nav__mark" onClick={() => go(0)} aria-label="The Listening Room — back to the street">
          <span className="nav__mark-name">The Listening Room</span>
          <span className="nav__mark-by mono">J. Oswal</span>
        </button>

        <div className="nav__right">
          <p className="nav__now mono" aria-live="polite">
            <span className="nav__now-dot" aria-hidden="true" />
            <span className="nav__now-code">{now.code}</span>
            <span className="nav__now-title">{now.title}</span>
          </p>
          <button
            type="button"
            ref={toggle}
            className="nav__toggle mono"
            aria-expanded={open}
            aria-controls="tracklist"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav__disc" aria-hidden="true" />
            {open ? 'Close' : 'Tracklist'}
          </button>
        </div>
        <div className="nav__groove" aria-hidden="true">
          <span ref={bar} />
        </div>
      </header>

      <div className={`tracklist ${open ? 'is-open' : ''}`} id="tracklist" ref={panel} aria-hidden={!open} {...({ inert: open ? undefined : '' } as Record<string, string | undefined>)}>
        <div className="tracklist__scrim" onClick={() => setOpen(false)} />
        <nav className="tracklist__sheet" aria-label="Tracklist" data-lenis-prevent>
          <p className="mono tracklist__cat">TLR-001 · Jia Oswal · The Listening Room</p>
          <h2 className="tracklist__title">Tracklist</h2>
          {(['A', 'B'] as const).map((side) => (
            <div key={side} className="tracklist__side">
              <p className="mono tracklist__side-head">Side {side}</p>
              <ol>
                {tracks
                  .filter((t) => t.code.startsWith(side))
                  .map((t) => (
                    <li key={t.id}>
                      <button type="button" onClick={() => go(`#${t.id}`)}>
                        <span className="mono tracklist__code">{t.code}</span>
                        <span className="tracklist__name">
                          {t.title}
                          <small className="mono">{t.nav}</small>
                        </span>
                        <span className="mono tracklist__time">{times[t.id]}</span>
                      </button>
                    </li>
                  ))}
              </ol>
            </div>
          ))}
          <div className="tracklist__extra">
            <button type="button" className="mono" onClick={() => go(marks.room)}>
              ◉ Back to the room
            </button>
            <button type="button" className="mono" onClick={() => go(marks.store)}>
              ⌂ The shop front
            </button>
            <button type="button" className="mono" onClick={() => go(0)}>
              ✦ Back to Earth
            </button>
          </div>
          {person.linkedin && (
            <a className="tracklist__hi" href={person.linkedin} target="_blank" rel="noreferrer">
              <span className="script">say hi</span>
              <span className="mono">on LinkedIn ↗</span>
            </a>
          )}
          <p className="tracklist__fine mono">Track times are real reading times, counted from the page.</p>
        </nav>
      </div>

      <SoundToggle />
    </>
  );
}
