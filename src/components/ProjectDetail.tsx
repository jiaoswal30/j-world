import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { projects, type Project } from '../content/site';
import { Flip, gsap, useGSAP } from '../lib/gsap';
import { lockScroll, prefersReducedMotion, unlockScroll } from '../lib/scroll';
import { rich } from '../lib/rich';
import { ProjectCover } from './ProjectCover';
import { Plate } from './Plate';
import { Vinyl } from './Vinyl';

type Props = {
  project: Project;
  flipState: Flip.FlipState | null;
  onClose: (state: Flip.FlipState | null) => void;
  onNext: (id: string) => void;
};

/**
 * The sleeve, opened. Not a modal box: the cover itself flies out of the crate
 * (GSAP Flip) and the liner notes unfold around it.
 */
export default function ProjectDetail({ project, flipState, onClose, onNext }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const idx = projects.findIndex((p) => p.id === project.id);
  const next = projects[(idx + 1) % projects.length];

  const requestClose = () => {
    if (closing.current) return;
    closing.current = true;
    const state = cover.current && !prefersReducedMotion() ? Flip.getState(cover.current) : null;
    gsap.to(root.current!.querySelectorAll('.detail__bg, .detail__fade, .detail__vinyl'), {
      autoAlpha: 0,
      duration: prefersReducedMotion() ? 0 : 0.35,
      ease: 'power2.in',
      onComplete: () => onClose(state),
    });
  };

  const closeViaHistory = () => {
    if ((history.state as { tlrProject?: string } | null)?.tlrProject) history.back();
    else requestClose();
  };

  // Scroll lock + history entry so the browser Back button closes the sleeve.
  useEffect(() => {
    lockScroll();
    const state = { tlrProject: project.id };
    if ((history.state as { tlrProject?: string } | null)?.tlrProject) history.replaceState(state, '', `#work/${project.id}`);
    else history.pushState(state, '', `#work/${project.id}`);

    const onPop = () => requestClose();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViaHistory();
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);
    closeBtn.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
      unlockScroll();
      // Switching to the next record keeps our history entry (the next effect replaces it);
      // only a real close clears the hash.
      if (closing.current && location.hash.startsWith('#work/')) history.replaceState(null, '', location.pathname + location.search);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  // useGSAP reverts on cleanup, so a re-run (React dev double-mount, next project)
  // always starts from clean layout instead of a half-finished Flip.
  useGSAP(
    () => {
      const el = root.current!;
      if (prefersReducedMotion()) return;
      const state = flipState;
      const tl = gsap.timeline();
      if (state && cover.current) {
        tl.fromTo(el.querySelector('.detail__bg'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0);
        tl.add(Flip.from(state, { targets: cover.current, duration: 0.95, ease: 'power3.inOut', zIndex: 5 }), 0);
      }
      tl.fromTo(el.querySelector('.detail__vinyl'), { xPercent: 0, rotation: -60 }, { xPercent: 24, rotation: 0, duration: 1.1, ease: 'power3.out' }, state ? 0.75 : 0).fromTo(
        el.querySelectorAll('.detail__fade'),
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.8, ease: 'power3.out' },
        state ? 0.55 : 0,
      );
    },
    { scope: root, dependencies: [project.id], revertOnUpdate: true },
  );

  return createPortal(
    <div className="detail" role="dialog" aria-modal="true" aria-labelledby={`detail-${project.id}`} ref={root}>
      <div className="detail__bg" />
      <div className="detail__scroll" data-lenis-prevent>
        <div className="detail__bar detail__fade">
          <button type="button" ref={closeBtn} className="detail__close mono" onClick={closeViaHistory}>
            <span aria-hidden="true">←</span> Back to the crate
          </button>
          <span className="mono detail__cat">{project.cat}</span>
          <span className="mono detail__esc" aria-hidden="true">
            Esc
          </span>
        </div>

        <div className="detail__grid">
          <aside className="detail__aside">
            <div className="detail__sleeve">
              <div className="detail__vinyl" aria-hidden="true">
                <Vinyl label="#E0A43A" ink="#1C1512" code={project.cat.slice(-5)} title={project.name} />
              </div>
              <div className="detail__cover" data-flip-id={`cover-${project.id}`} ref={cover}>
                <ProjectCover kind={project.cover} />
              </div>
            </div>
            <dl className="detail__facts detail__fade">
              <div>
                <dt className="mono">Role</dt>
                <dd>{rich(project.role)}</dd>
              </div>
              <div>
                <dt className="mono">Year</dt>
                <dd>{rich(project.year)}</dd>
              </div>
              <div>
                <dt className="mono">Tools</dt>
                <dd>{rich(project.tools.join(' · '))}</dd>
              </div>
              {project.link && (
                <div>
                  <dt className="mono">Live</dt>
                  <dd>
                    <a href={project.link.href} target="_blank" rel="noreferrer">
                      {project.link.label} ↗
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </aside>

          <article className="detail__body">
            <h2 className="detail__title detail__fade" id={`detail-${project.id}`}>
              {project.name}
            </h2>
            <p className="detail__tagline detail__fade">{project.tagline}</p>

            <section className="detail__block detail__fade">
              <h3 className="mono">The opportunity</h3>
              <p className="detail__lead">{rich(project.opportunity)}</p>
            </section>

            <section className="detail__block detail__fade">
              <h3 className="mono">The thinking</h3>
              <ol className="detail__thinking">
                {project.thinking.map((t, i) => (
                  <li key={i}>
                    <span className="detail__num">{String(i + 1).padStart(2, '0')}</span>
                    <p>{rich(t)}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="detail__block detail__fade">
              <h3 className="mono">What I actually did</h3>
              <ul className="detail__did">
                {project.executed.map((t, i) => (
                  <li key={i}>{rich(t)}</li>
                ))}
              </ul>
            </section>

            <div className="detail__pair detail__fade">
              <section className="detail__block">
                <h3 className="mono">Outcomes</h3>
                <p>{rich(project.outcomes)}</p>
              </section>
              <section className="detail__block">
                <h3 className="mono">What it taught me</h3>
                <p>{rich(project.learned)}</p>
              </section>
            </div>

            <div className="detail__images detail__fade">
              {project.images.map((img, i) => (
                <figure key={i} className="detail__figure">
                  <Plate src={img.src} art={img.art} alt={img.alt} ratio={img.ratio} tone={i % 2 ? 'paper' : 'ice'} label={img.caption} />
                  <figcaption className="mono">{img.caption}</figcaption>
                </figure>
              ))}
            </div>

            <div className="detail__end detail__fade">
              <button type="button" className="detail__next" onClick={() => onNext(next.id)}>
                <span className="mono">Next record</span>
                <span className="detail__next-name">{next.name} →</span>
              </button>
              <button type="button" className="detail__back mono" onClick={closeViaHistory}>
                Put it back in the crate
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>,
    document.body,
  );
}
