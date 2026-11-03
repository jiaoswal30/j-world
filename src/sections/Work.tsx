import { lazy, Suspense, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { looseSingles, projects, tracks } from '../content/site';
import { Flip } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/scroll';
import { useReveal } from '../lib/useReveal';
import { SectionHead } from '../components/SectionHead';
import { ProjectCover } from '../components/ProjectCover';
import { Vinyl } from '../components/Vinyl';

const ProjectDetail = lazy(() => import('../components/ProjectDetail'));
const track = tracks.find((t) => t.id === 'work')!;

/** B1 — Things I've Built. A crate of sleeves; pulling one opens it into liner notes. */
export function Work() {
  const ref = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [binOpen, setBinOpen] = useState(false);
  const flipState = useRef<Flip.FlipState | null>(null);
  const returning = useRef<string | null>(null);
  useReveal(ref);

  const open = (id: string, button: HTMLElement) => {
    const cover = button.querySelector<HTMLElement>('[data-flip-id]');
    flipState.current = cover && !prefersReducedMotion() ? Flip.getState(cover) : null;
    setOpenId(id);
  };

  const close = useCallback((state: Flip.FlipState | null) => {
    setOpenId((current) => {
      returning.current = current;
      return null;
    });
    flipState.current = state;
  }, []);

  // Fly the cover home after the detail view closes.
  useLayoutEffect(() => {
    if (openId !== null || !returning.current) return;
    const id = returning.current;
    returning.current = null;
    const target = ref.current?.querySelector<HTMLElement>(`[data-flip-id="cover-${id}"]`);
    if (flipState.current && target) {
      Flip.from(flipState.current, { targets: target, duration: 0.8, ease: 'power3.inOut', zIndex: 120 });
    }
    flipState.current = null;
    ref.current?.querySelector<HTMLElement>(`[data-project="${id}"]`)?.focus({ preventScroll: true });
  }, [openId]);

  const project = projects.find((p) => p.id === openId) ?? null;

  return (
    <section className="section work" id="work" ref={ref}>
      <SectionHead
        track={track}
        kicker="Side B · Track 1"
        intro="Pull a sleeve out of the crate. Each one opens into the thinking, what I actually did, and what's still unconfirmed."
      />

      <ul className="crate">
        {projects.map((p, i) => (
          <li key={p.id} className={`crate__item ${openId === p.id ? 'is-out' : ''}`} data-rise>
            <button type="button" className="crate__sleeve" data-project={p.id} onClick={(e) => open(p.id, e.currentTarget)} aria-label={`Open ${p.name}`}>
              <span className="crate__vinyl" aria-hidden="true">
                <Vinyl label={['#C9B8E8', '#E0A43A', '#EFE7D6'][i % 3]} ink="#1C1512" code={`B1·0${i + 1}`} title={p.name} />
              </span>
              <span className="crate__cover" data-flip-id={`cover-${p.id}`}>
                <ProjectCover kind={p.cover} />
              </span>
            </button>
            <div className="crate__meta">
              <span className="mono">{p.cat}</span>
              <h3 className="crate__name">{p.name}</h3>
              <p className="crate__tagline">{p.tagline}</p>
              <p className="mono crate__role">{p.role.replace(/\[TBC:[^\]]*\]/g, '').trim()}</p>
            </div>
          </li>
        ))}

        <li className="crate__item crate__item--bin" data-rise>
          <div className={`bin ${binOpen ? 'is-open' : ''}`}>
            <p className="mono">B1 · 04</p>
            <h3 className="crate__name">Loose singles</h3>
            <p className="crate__tagline">Prototypes, side projects and things that didn't need a whole sleeve.</p>
            <button type="button" className="bin__toggle mono" aria-expanded={binOpen} aria-controls="bin-list" onClick={() => setBinOpen((v) => !v)}>
              {binOpen ? 'Close the bin' : `Rummage (${looseSingles.length})`}
              <span aria-hidden="true">{binOpen ? '−' : '+'}</span>
            </button>
            <div id="bin-list" className="bin__list" hidden={!binOpen}>
              <ul>
                {looseSingles.map((s) => (
                  <li key={s.name}>
                    <span className="mono">{s.year}</span>
                    {s.href ? (
                      <a href={s.href} target="_blank" rel="noreferrer">
                        {s.name} ↗
                      </a>
                    ) : (
                      <strong>{s.name}</strong>
                    )}
                    <span className="bin__note">{s.note}</span>
                  </li>
                ))}
              </ul>
              <p className="hand bin__empty">mostly empty on purpose — I'd rather show three real things than ten padded ones.</p>
            </div>
          </div>
        </li>
      </ul>

      <Suspense fallback={null}>
        {project && <ProjectDetail project={project} flipState={flipState.current} onClose={close} onNext={(id) => {
              flipState.current = null;
              setOpenId(id);
            }}
          />}
      </Suspense>
    </section>
  );
}
