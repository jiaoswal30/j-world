import { room, tracks, type Track } from '../content/site';
import { SleeveArt } from './SleeveArt';
import { Vinyl } from './Vinyl';

const records = tracks.filter((t) => t.art);
const TILTS = [-2.5, 1.5, -1, 2, -1.8];

type Props = { onPlay: (track: Track, el: HTMLElement) => void; railRef: React.Ref<HTMLDivElement> };

/**
 * The "new arrivals" rail in the front of the room. Each record is a real button:
 * hover pulls the vinyl half out of its sleeve; click plays it on the turntable.
 */
export function RecordCollection({ onPlay, railRef }: Props) {
  return (
    <div className="rail" ref={railRef}>
      <ul className="rail__list" data-lenis-prevent-horizontal aria-label="Records — each one opens a part of the portfolio">
        {records.map((t, i) => (
          <li key={t.id} className="rail__item" style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` } as React.CSSProperties}>
            <button
              type="button"
              className="sleeve"
              onClick={(e) => onPlay(t, e.currentTarget)}
              aria-label={`Play ${t.code}, ${t.title} — goes to ${t.nav}`}
            >
              <span className="sleeve__vinyl">
                <Vinyl label={t.label} ink={t.labelInk} code={t.code} title={t.title} />
              </span>
              <span className="sleeve__cover">
                <SleeveArt art={t.art!} code={t.code} />
                <span className="sleeve__foil" />
              </span>
              <span className="sleeve__tag" aria-hidden="true">
                <span className="mono">{t.code}</span>
                <span className="sleeve__tag-title">{t.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="rail__ledge" aria-hidden="true" />
      <p className="rail__caption mono">{room.railCaption}</p>
    </div>
  );
}
