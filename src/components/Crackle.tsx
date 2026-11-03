import { jazz, useJazz } from '../lib/jazz';

/** Sound is opt-in: a late-night jazz trio with vinyl crackle, synthesised live. */
export function SoundToggle() {
  const on = useJazz();
  return (
    <button type="button" className={`crackle mono ${on ? 'is-on' : ''}`} onClick={() => jazz.toggle()} aria-pressed={on}>
      <span className="crackle__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {on ? 'Now playing: late-night trio' : 'Sound: off'}
    </button>
  );
}
