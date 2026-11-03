import { forwardRef } from 'react';
import { exterior } from '../content/site';

/** Cast-iron street lamp, foreground left. Moves faster than the facade = depth. */
export const LampPost = forwardRef<HTMLDivElement>(function LampPost(_, ref) {
  return (
    <div className="lamppost" ref={ref} aria-hidden="true">
      <span className="lamppost__glow" />
      <svg viewBox="0 0 140 900" preserveAspectRatio="xMidYMax meet">
        <path d="M56 170 H84 L80 210 H60 Z" fill="#14100E" />
        <path d="M48 100 H92 L84 168 H56 Z" fill="#F7D08A" />
        <path d="M48 100 H92 L84 168 H56 Z" fill="none" stroke="#14100E" strokeWidth="4" />
        <line x1="70" y1="100" x2="70" y2="168" stroke="#14100E" strokeWidth="2" />
        <path d="M40 100 L70 70 L100 100 Z" fill="#14100E" />
        <circle cx="70" cy="64" r="7" fill="#14100E" />
        <rect x="64" y="210" width="12" height="620" fill="#14100E" />
        <path d="M70 330 Q30 300 34 260 M70 330 Q110 300 106 260" fill="none" stroke="#14100E" strokeWidth="5" />
        <rect x="52" y="820" width="36" height="80" fill="#14100E" />
        <rect x="46" y="812" width="48" height="12" fill="#14100E" />
      </svg>
    </div>
  );
});

/** Sandwich-board chalkboard on the pavement — the opening line lives here. */
export const Chalkboard = forwardRef<HTMLDivElement>(function Chalkboard(_, ref) {
  return (
    <div className="chalkboard" ref={ref}>
      <div className="chalkboard__board">
        <span className="chalkboard__head mono">Today, inside</span>
        <p className="chalkboard__text">{exterior.chalkboard}</p>
        <span className="chalkboard__sign">{exterior.chalkSign}</span>
      </div>
      <span className="chalkboard__leg chalkboard__leg--l" aria-hidden="true" />
      <span className="chalkboard__leg chalkboard__leg--r" aria-hidden="true" />
    </div>
  );
});
