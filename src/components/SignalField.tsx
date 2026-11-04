import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/scroll';

type P = { hx: number; hy: number; sx: number; sy: number; x: number; y: number; vx: number; vy: number; ch: string; hot: boolean; seed: number };

const INK = 'rgba(28,21,18,0.86)';
const HOT = '#FF4D1F';

/**
 * A field of characters — the words of the notes, broken into noise — that
 * assembles into one word as you scroll in. The cursor (or a finger) scatters it;
 * it always finds its way back. Figuring it out, as an interaction.
 */
export function SignalField({ word, stream }: { word: string; stream: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = wrap.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext('2d')!;
    const reduced = prefersReducedMotion();
    let W = 0;
    let H = 0;
    let dpr = 1;
    let glyph = 10;
    let parts: P[] = [];
    let assemble = reduced ? 1 : 0;
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    let visible = false;
    let t = 0;

    const build = () => {
      const r = el.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;

      // rasterise the word, then sample it on a grid of character cells
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const o = off.getContext('2d')!;
      const face = (px: number) => `900 ${px}px "Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif`;
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      o.fillStyle = '#000';
      // narrow screens: stack the word in two big lines instead of one thin strip
      const lines = W < 700 ? [word.slice(0, Math.ceil(word.length / 2)), word.slice(Math.ceil(word.length / 2))] : [word];
      let size = lines.length > 1 ? Math.min(W * 0.42, (H / lines.length) * 0.92) : Math.min(W * 0.26, H * 0.9);
      o.font = face(size);
      const widest = Math.max(...lines.map((l) => o.measureText(l).width));
      if (widest > W * 0.94) size *= (W * 0.94) / widest;
      o.font = face(size);
      lines.forEach((l, i) => o.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * size * 0.92));
      const data = o.getImageData(0, 0, W, H).data;

      const mobile = W < 700;
      let step = Math.max(mobile ? 5 : 7, Math.round(W / (mobile ? 72 : 170)));
      glyph = Math.max(6, Math.round(step * 1.3));
      const sample = () => {
        const pts: [number, number][] = [];
        for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (data[(y * W + x) * 4 + 3] > 140) pts.push([x, y]);
        return pts;
      };
      let pts = sample();
      const cap = mobile ? 1400 : 3400;
      while (pts.length > cap) {
        step += 1;
        glyph = Math.max(7, Math.round(step * 1.25));
        pts = sample();
      }

      const chars = stream.replace(/\s+/g, ' ');
      parts = pts.map(([x, y], i) => {
        const sx = Math.random() * W;
        const sy = Math.random() * H;
        return { hx: x, hy: y, sx, sy, x: sx, y: sy, vx: 0, vy: 0, ch: chars[i % chars.length] === ' ' ? '·' : chars[i % chars.length], hot: Math.random() < 0.06, seed: Math.random() * 1000 };
      });
      if (assemble >= 1) parts.forEach((p) => ((p.x = p.hx), (p.y = p.hy)));
      setCount(parts.length);
      draw();
    };

    const ease = (v: number) => 1 - Math.pow(1 - v, 3);

    const step = () => {
      t += 0.016;
      const a = ease(assemble);
      const R = Math.max(80, W * 0.1);
      for (const p of parts) {
        // home, blended with its noise position while the word is still forming
        let tx = p.sx + (p.hx - p.sx) * a;
        let ty = p.sy + (p.hy - p.sy) * a;
        if (a < 1) {
          tx += Math.sin(t * 0.8 + p.seed) * 8 * (1 - a);
          ty += Math.cos(t * 0.7 + p.seed) * 8 * (1 - a);
        }
        let fx = (tx - p.x) * 0.06;
        let fy = (ty - p.y) * 0.06;
        if (pointer) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / R) * 14;
            fx += (dx / d) * f;
            fy += (dy / d) * f;
          }
        }
        p.vx = (p.vx + fx) * 0.82;
        p.vy = (p.vy + fy) * 0.82;
        p.x += p.vx;
        p.y += p.vy;
      }
    };

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.font = `${glyph}px "IBM Plex Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = INK;
      for (const p of parts) if (!p.hot) ctx.fillText(p.ch, p.x, p.y);
      ctx.fillStyle = HOT;
      for (const p of parts) if (p.hot) ctx.fillText(p.ch, p.x, p.y);
    }

    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    const run = () => {
      if (reduced || raf || !visible) return;
      raf = requestAnimationFrame(loop);
    };
    const halt = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) run();
      else halt();
    });
    io.observe(el);

    // noise → word as the field scrolls into view (scrubbed, so it reverses too)
    const st = reduced
      ? null
      : ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          end: 'center 55%',
          scrub: true,
          onUpdate: (self) => (assemble = self.progress),
        });

    const toLocal = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const leave = () => (pointer = null);
    el.addEventListener('pointermove', toLocal);
    el.addEventListener('pointerdown', toLocal);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('pointerup', leave);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    };
    window.addEventListener('resize', onResize);

    // wait for webfonts (the glyphs are IBM Plex Mono) before sampling
    let cancelled = false;
    Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 2000))]).then(() => !cancelled && build());

    return () => {
      cancelled = true;
      halt();
      io.disconnect();
      st?.kill();
      el.removeEventListener('pointermove', toLocal);
      el.removeEventListener('pointerdown', toLocal);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('pointerup', leave);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
    };
  }, [word, stream]);

  return (
    <figure className="signal-field">
      <div className="signal-field__stage" ref={wrap}>
        <canvas ref={canvas} role="img" aria-label={`A field of characters assembling into the word ${word}`} />
      </div>
      <figcaption className="signal-field__cap mono">
        <span>fig. 01 — {count.toLocaleString('en-IN')} characters, one idea</span>
        <span className="signal-field__hint">move through it →</span>
      </figcaption>
    </figure>
  );
}
