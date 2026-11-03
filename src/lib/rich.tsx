import { Fragment, type ReactNode } from 'react';

/**
 * Tiny inline markup for content strings:
 *   *italic*          → <em>
 *   [TBC: something]  → a clearly-marked placeholder Jia still needs to fill in
 */
export function rich(text: string): ReactNode {
  const parts = text.split(/(\[TBC:[^\]]*\]|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('[TBC:')) {
      return (
        <mark className="tbc" key={i} title="Placeholder — to be confirmed">
          {part.slice(5, -1).trim()}
        </mark>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Deterministic PRNG so procedurally drawn shelves look the same on every visit. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
