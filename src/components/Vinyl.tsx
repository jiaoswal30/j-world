import type { CSSProperties } from 'react';

type Props = {
  label: string;
  ink: string;
  code?: string;
  title?: string;
  className?: string;
};

/**
 * A record. The disc (grooves + label) is what spins; the sheen sits on top
 * and stays still, the way a room light stays put on a turning record.
 */
export function Vinyl({ label, ink, code, title, className = '' }: Props) {
  const style = { '--label': label, '--label-ink': ink } as CSSProperties;
  return (
    <div className={`vinyl ${className}`} style={style} aria-hidden="true">
      <div className="vinyl__disc">
        <div className="vinyl__label">
          {code && <span className="vinyl__code">{code}</span>}
          {title && <span className="vinyl__title">{title}</span>}
          <span className="vinyl__rpm">33⅓</span>
          <span className="vinyl__hole" />
        </div>
      </div>
      <div className="vinyl__sheen" />
    </div>
  );
}
