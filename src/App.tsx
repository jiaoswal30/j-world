import { useEffect } from 'react';
import { initScroll, scrollToTarget } from './lib/scroll';
import { ScrollTrigger } from './lib/gsap';
import { Navigation } from './components/Navigation';
import { Arrival } from './sections/Arrival';
import { About } from './sections/About';
import { Receipts } from './sections/Receipts';
import { Work } from './sections/Work';
import { Experiments } from './sections/Experiments';
import { Gallery } from './sections/Gallery';
import { Editorial } from './sections/Editorial';
import { LastTrack } from './sections/LastTrack';

/** Show the type once its fonts are in, so the sign never flashes in a fallback face. (The Earth doesn't wait.) */
function useCurtain() {
  useEffect(() => {
    let done = false;
    const lift = () => {
      if (done) return;
      done = true;
      const html = document.documentElement;
      html.classList.remove('fonts-pending');
      html.classList.add('fonts-in');
      ScrollTrigger.refresh();
    };
    const timeout = window.setTimeout(lift, 1200);
    document.fonts?.ready.then(() => {
      window.clearTimeout(timeout);
      lift();
    });
    return () => window.clearTimeout(timeout);
  }, []);
}

export default function App() {
  useEffect(() => initScroll(), []);
  useCurtain();
  // images and fonts can shift layout after first paint; re-measure every trigger once all is in
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') refresh();
    else window.addEventListener('load', refresh, { once: true });
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <>
      <a className="skip-link" href="#about" onClick={(e) => { e.preventDefault(); scrollToTarget('#about', { duration: 0.01 }); document.getElementById('about')?.focus({ preventScroll: true }); }}>
        Skip the intro
      </a>
      <div className="grain" aria-hidden="true" />
      <Navigation />
      <main>
        <Arrival />
        <About />
        <Receipts />
        <Work />
        <Experiments />
        <Gallery />
        <Editorial />
        <LastTrack />
      </main>
    </>
  );
}
