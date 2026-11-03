import { useRef } from 'react';
import { note } from '../content/site';
import { rich } from '../lib/rich';
import { useReveal } from '../lib/useReveal';

/** B4 — The liner note. The one place the room goes quiet and you just read. */
export function Editorial() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="section note" id="note" ref={ref}>
      <article className="insert">
        <header className="insert__head">
          <p className="mono insert__kicker">
            <span>B4</span>
            <span>Liner note — found inside the sleeve</span>
          </p>
          <h2 className="insert__title" data-split>
            {note.title}
          </h2>
          <p className="insert__intro" data-rise>
            {note.intro}
          </p>
        </header>

        {note.parts.map((p, i) => (
          <section key={p.head} className="insert__part" data-rise>
            <span className="insert__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="insert__h">{p.head}</h3>
            <p className={i === 0 ? 'insert__p insert__p--first' : 'insert__p'}>{rich(p.body)}</p>
            {'pull' in p && p.pull && (
              <blockquote className="insert__pull">
                <p>{p.pull}</p>
              </blockquote>
            )}
            {'margin' in p && p.margin && <span className="insert__margin hand">({p.margin})</span>}
          </section>
        ))}

        <p className="insert__signoff hand">{note.signoff}</p>
      </article>
    </section>
  );
}
