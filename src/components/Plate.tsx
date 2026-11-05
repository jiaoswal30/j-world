import { useEffect, useRef, useState } from 'react';
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
/** A photo that stays invisible (no alt text, no broken-image icon) until it has actually arrived. */
function Photo({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const retried = useRef(false);
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);
  const onError = () => {
    // one quiet retry for a dropped connection; otherwise the folder's own colour holds the space
    const img = ref.current;
    if (!img || retried.current) return;
    retried.current = true;
    window.setTimeout(() => (img.src = `${asset(src)}?r=1`), 800);
  };
  return (
    <img
      ref={ref}
      className={`plate__img${loaded ? ' is-loaded' : ''}`}
      src={asset(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={onError}
    />
  );
}

export function Plate({ src, art, alt, ratio, tone = 'paper', label }: Props) {
  if (art) {
    return (
      <div className="plate plate--art" style={{ aspectRatio: ratio }}>
        <Artwork kind={art} />
      </div>
    );
  }
  if (src) {
    return <Photo src={src} alt={alt} />;
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
