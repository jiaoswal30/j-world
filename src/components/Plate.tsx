import { Artwork } from './Artwork';
import { asset } from '../lib/asset';
import type { ArtKind } from '../content/site';

type Props = {
  src: string | null;
  art?: ArtKind;
  alt: string;
  ratio: string;
  tone?: string;
  label?: string;
};

/**
 * A real image keeps its own proportions (never cropped).
 * Without one, a designed placeholder plate holds the space and says what goes there.
 */
export function Plate({ src, art, alt, ratio, tone = 'paper', label }: Props) {
  if (art) {
    return (
      <div className="plate plate--art" style={{ aspectRatio: ratio }}>
        <Artwork kind={art} />
      </div>
    );
  }
  if (src) {
    return <img className="plate__img" src={asset(src)} alt={alt} loading="lazy" decoding="async" />;
  }
  return (
    <div className={`plate plate--${tone}`} style={{ aspectRatio: ratio }} role="img" aria-label={`Placeholder for: ${alt}`}>
      <span className="plate__motif" aria-hidden="true" />
      <span className="plate__crop plate__crop--tl" aria-hidden="true" />
      <span className="plate__crop plate__crop--br" aria-hidden="true" />
      <span className="plate__ratio mono">{ratio.replace(/\s/g, '')}</span>
      <span className="plate__label mono">Image to come{label ? ` — ${label}` : ''}</span>
    </div>
  );
}
