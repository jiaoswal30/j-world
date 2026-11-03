import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { marks, prefersReducedMotion, scrollToTarget } from '../lib/scroll';
import { rich } from '../lib/rich';
import { room, type Track } from '../content/site';
import { StoreExterior, type DoorRefs } from '../components/StoreExterior';
import { RoomArt, RingText } from '../components/ListeningRoom';
import { Turntable, ARM_PLAYING, type TurntableHandle } from '../components/Turntable';
import { LampPost, Chalkboard } from '../components/Foreground';
import { RecordCollection } from '../components/RecordCollection';
import { Journey, type JourneyHandle } from '../components/Journey';
import { SafeBoundary } from '../components/SafeBoundary';

/** Point on the facade the camera dollies into: the centre of the doorway. */
const DOOR_ORIGIN = '50% 74.75%';

/**
 * Prologue + Scenes 01–03: Earth → Bengaluru → the street → the doors → the room.
 * One pinned, scrubbed timeline — so scrolling backwards simply plays it in reverse.
 */
export function Arrival() {
  const root = useRef<HTMLElement>(null);
  const exteriorLayer = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const interior = useRef<HTMLDivElement>(null);
  const vignette = useRef<HTMLDivElement>(null);
  const lamp = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const doorway = useRef<HTMLDivElement>(null);
  const bloom = useRef<HTMLDivElement>(null);
  const journey = useRef<JourneyHandle | null>(null);
  const doors = useRef<DoorRefs>({ left: null, right: null });
  const tt = useRef<TurntableHandle | null>(null);
  const busy = useRef(false);
  const [now, setNow] = useState<Track | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const railItems = rail.current!.querySelectorAll('.rail__item');
        const caption = rail.current!.querySelector('.rail__caption');

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * 6.6)}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            // no invalidateOnRefresh: Safari re-measures after fonts/images load, and re-recording
            // start values then captured the *end* state (map shown, globe at the surface) at scroll 0
            onRefresh: (self) => {
              marks.room = self.end;
              const tl = self.animation;
              if (tl) marks.store = self.start + ((tl as gsap.core.Timeline).labels.store / tl.duration()) * (self.end - self.start);
            },
          },
        });

        // ── PROLOGUE: Earth → clouds → India → Karnataka → Bengaluru ──
        const J = journey.current;
        if (!J) {
          // prologue failed to mount (see SafeBoundary): start straight at the shop
          tl.addLabel('store', 0);
        } else {
          const t = J.title;
          const proxy = { p: 0 };
          // map camera: keep the focus point centred while scaling around it
          const cam = { fx: 306, fy: 348, s: 1 };
          const applyCam = () => J.zoom.setAttribute('transform', `translate(${306 - cam.fx * cam.s} ${348 - cam.fy * cam.s}) scale(${cam.s})`);
          const focusTo = (key: 'karnataka' | 'bengaluru') => ({
            fx: () => J.focus[key].x,
            fy: () => J.focus[key].y,
            s: () => J.focus[key].s,
            onUpdate: applyCam,
          });

          gsap.set(J.map, { autoAlpha: 0 });
          tl.to(
            proxy,
            {
              p: 1,
              duration: 8.2,
              onUpdate: () => {
                const g = J.globe;
                if (!g) return;
                g.setProgress(proxy.p);
                if (proxy.p < 0.93) g.start();
                else g.stop();
              },
            },
            0,
          )
            // title card leaves the way it arrived in the edit: blur, lift, scatter
            .to(t.querySelectorAll('.tcard__heading, .tcard__sub, .tcard__sound, .tcard__scroll'), { autoAlpha: 0, y: -24, stagger: 0.07, duration: 0.8, ease: 'power2.in' }, 0.25)
            .to(t.querySelector('.tcard__word-main'), { yPercent: -35, scale: 1.12, filter: 'blur(14px)', autoAlpha: 0, duration: 1.8, ease: 'power2.in' }, 0.45)
            .to(t.querySelector('.tcard__word-ghost'), { yPercent: 45, autoAlpha: 0, duration: 1.8, ease: 'power2.in' }, 0.45)
            .to(t.querySelectorAll('.tcard__repeat li'), { xPercent: 80, autoAlpha: 0, stagger: 0.06, duration: 1, ease: 'power2.in' }, 0.35)
            .to(t.querySelectorAll('.tcard__dot, .sparkle'), { scale: 0, autoAlpha: 0, stagger: 0.05, duration: 0.7, ease: 'back.in(2)' }, 0.35)
            .to(t.querySelectorAll('.tcard__corner, .tcard__ticks'), { autoAlpha: 0, duration: 0.8 }, 0.7)
            .set(t, { autoAlpha: 0 }, 2.4);

          // story captions
          const caps = J.captions;
          const at = [1.7, 3.6, 5.4, 9.0, 10.7];
          caps.forEach((c, i) => {
            tl.fromTo(c, { autoAlpha: 0, y: 26, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, at[i]);
            tl.to(c, { autoAlpha: 0, y: -18, filter: 'blur(6px)', duration: 0.55, ease: 'power2.in' }, i === caps.length - 1 ? 11.6 : at[i] + 1.45);
          });

          // through the clouds → the map
          tl.fromTo(J.fog, { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'power1.in' }, 6.3)
            // explicit start state: Safari can run this before the stylesheet hides the map,
            // so a bare .set() recorded 'visible' as the state to return to
            .fromTo(J.map, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001, immediateRender: false }, 7.3)
            .set(J.root.querySelector('.journey__canvas'), { autoAlpha: 0 }, 7.4)
            .to(J.fog, { opacity: 0, duration: 1, ease: 'power1.out' }, 7.5)
            .fromTo(J.states, { opacity: 0 }, { opacity: 1, stagger: { each: 0.014, from: 'random' }, duration: 0.6 }, 7.4)
            .fromTo(J.labels.querySelector('.map-label--india'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 7.9)
            .to(J.labels.querySelector('.map-label--india'), { autoAlpha: 0, duration: 0.4 }, 8.8)
            .fromTo(J.karnataka, { fill: '#1B2138' }, { fill: '#7E2A2C', duration: 0.6, ease: 'none' }, 8.4)
            .to(cam, { ...focusTo('karnataka'), duration: 1.2, ease: 'power3.inOut' }, 8.8)
            .fromTo(J.labels.querySelector('.map-label--ka'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 9.4)
            .to(J.labels.querySelector('.map-label--ka'), { autoAlpha: 0, duration: 0.35 }, 10.1)
            .to(cam, { ...focusTo('bengaluru'), duration: 1.3, ease: 'power3.inOut' }, 10.0)
            .fromTo(J.labels.querySelector('.map-pin'), { autoAlpha: 0, y: -46, scale: 0.4 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(2.4)' }, 10.7)
            .fromTo(J.labels.querySelector('.map-label--blr'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.5 }, 10.9)
            // the pin opens like an aperture onto the street
            .fromTo(J.root, { '--hole': '0vmax' }, { '--hole': '130vmax', duration: 1.4, ease: 'power2.in' }, 11.4)
            .set(J.root, { autoAlpha: 0 }, 12.8)
            .addLabel('store', 12.6);
        }

        // ── THE STREET → THE ROOM ──
        const S = 'store';
        tl.to(hint.current, { autoAlpha: 0, y: 12, duration: 0.6 }, `${S}+=0.4`)
          .to(camera.current, { scale: 2.4, duration: 5, ease: 'power1.in' }, S)
          .to(lamp.current, { xPercent: -90, scale: 1.5, duration: 4, ease: 'power1.in' }, S)
          .to(board.current, { xPercent: 90, yPercent: 40, scale: 1.7, duration: 4, ease: 'power1.in' }, S)
          .to(board.current, { autoAlpha: 0, duration: 1 }, `${S}+=3`)
          .to(lamp.current, { autoAlpha: 0, duration: 1 }, `${S}+=3`)
          .to(vignette.current, { opacity: 1, duration: 4.5 }, S)
          .to(doors.current.left, { rotationY: 84, duration: 3, ease: 'power2.inOut' }, `${S}+=2`)
          .to(doors.current.right, { rotationY: -84, duration: 3, ease: 'power2.inOut' }, `${S}+=2`)
          // step over the threshold: warm light swallows the frame, the room is on the other side
          .to(camera.current, { scale: 4.6, duration: 2.4, ease: 'power2.in' }, `${S}+=5`)
          .fromTo(bloom.current, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power2.in' }, `${S}+=5.6`)
          .to(exteriorLayer.current, { autoAlpha: 0, duration: 0.3 }, `${S}+=7.1`)
          .to(vignette.current, { opacity: 0, duration: 0.6 }, `${S}+=6.7`)
          .fromTo(interior.current, { scale: 1.18 }, { scale: 1, duration: 2.6, ease: 'power2.out' }, `${S}+=6.9`)
          .to(bloom.current, { opacity: 0, duration: 1.5, ease: 'power2.out' }, `${S}+=7.3`)
          .fromTo(card.current, { autoAlpha: 0, y: 40, rotation: -5 }, { autoAlpha: 1, y: 0, rotation: -1.5, duration: 1.4, ease: 'power3.out' }, `${S}+=8.2`)
          .fromTo(railItems, { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, stagger: 0.14, duration: 1.2, ease: 'power3.out' }, `${S}+=8.6`)
          .fromTo(caption, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, `${S}+=9.4`)
          .to({}, { duration: 0.8 });

        // Spin the house record only while the room can be seen.
        const spinST = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            const spin = tt.current?.spin;
            if (!spin) return;
            if (self.isActive) spin.play();
            else spin.pause();
          },
        });

        return () => spinST.kill();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        marks.store = root.current!.offsetTop + window.innerHeight;
        marks.room = root.current!.offsetTop + window.innerHeight * 2;
      });
    },
    { scope: root },
  );

  /** Pick a record → it leaves its sleeve, lands on the platter, the arm drops, we go there. */
  const play = (track: Track, sleeve: HTMLElement) => {
    const deck = tt.current;
    const src = sleeve.querySelector<HTMLElement>('.sleeve__vinyl');
    if (prefersReducedMotion() || !deck || !src) {
      scrollToTarget(`#${track.id}`);
      return;
    }
    if (busy.current) return;
    busy.current = true;
    sleeve.closest('.rail')?.classList.add('is-playing');

    const a = src.getBoundingClientRect();
    const b = deck.platter.getBoundingClientRect();
    const ghost = src.cloneNode(true) as HTMLElement;
    ghost.classList.add('vinyl-ghost');
    Object.assign(ghost.style, {
      position: 'fixed',
      left: `${a.left}px`,
      top: `${a.top}px`,
      width: `${a.width}px`,
      height: `${a.height}px`,
      margin: '0',
      zIndex: '80',
      transform: 'none',
    });
    document.body.appendChild(ghost);
    const ghostDisc = ghost.querySelector('.vinyl__disc');
    gsap.set(src, { autoAlpha: 0 });

    const finish = () => {
      ghost.remove();
      gsap.set(src, { clearProps: 'opacity,visibility' });
      sleeve.closest('.rail')?.classList.remove('is-playing');
      busy.current = false;
    };

    gsap
      .timeline({ onComplete: finish })
      .to(deck.arm, { rotation: 0, duration: 0.45, ease: 'power2.inOut' }, 0)
      .to(deck.spin, { timeScale: 0.05, duration: 0.5, ease: 'power1.out' }, 0)
      .to(ghost, { y: -a.height * 0.6, duration: 0.45, ease: 'power2.out' }, 0)
      .to(
        ghost,
        {
          x: b.left - a.left,
          y: b.top - a.top,
          scaleX: b.width / a.width,
          scaleY: b.height / a.width,
          transformOrigin: '0 0',
          duration: 1,
          ease: 'power3.inOut',
        },
        0.4,
      )
      .to(ghostDisc, { rotation: 300, duration: 1.1, ease: 'power2.inOut' }, 0.35)
      .to(deck.record, { autoAlpha: 0, duration: 0.25 }, 0.85)
      .add(() => setNow(track), 1.3)
      .to(deck.record, { autoAlpha: 1, duration: 0.2 }, 1.38)
      .to(ghost, { autoAlpha: 0, duration: 0.2 }, 1.4)
      .to(deck.arm, { rotation: ARM_PLAYING, duration: 0.6, ease: 'power2.inOut' }, 1.5)
      .add(() => {
        deck.spin.play();
        gsap.to(deck.spin, { timeScale: 1, duration: 1.2, ease: 'power1.in' });
      }, 1.9)
      .add(() => scrollToTarget(`#${track.id}`, { duration: 2 }), 2.35);
  };

  return (
    <section className="arrival" ref={root} id="top" aria-label="Jia's World — from Earth to the Listening Room">
      <div className="arrival__layer arrival__interior" ref={interior} style={{ transformOrigin: DOOR_ORIGIN }}>
        <div className="stage">
          <RoomArt />
          <RingText />
          <Turntable ref={tt} now={now} />
        </div>
      </div>

      <div className="arrival__layer arrival__room-ui">
        <div className="room-card" ref={card}>
          <span className="room-card__tape" aria-hidden="true" />
          <p className="mono room-card__kicker">{room.kicker}</p>
          <h2 className="room-card__statement">{rich(room.statement)}</h2>
        </div>
        <RecordCollection onPlay={play} railRef={rail} />
      </div>

      <div className="arrival__layer arrival__exterior" ref={exteriorLayer}>
        <div className="stage" ref={camera} style={{ transformOrigin: DOOR_ORIGIN }}>
          <StoreExterior doorsRef={doorway} doorRefs={doors} />
        </div>
        <div className="arrival__vignette" ref={vignette} />
        <div className="arrival__bloom" ref={bloom} />
        <LampPost ref={lamp} />
        <Chalkboard ref={board} />
        <div className="scroll-hint" ref={hint}>
          <span className="mono">Scroll to come in</span>
          <span className="scroll-hint__line" aria-hidden="true" />
        </div>
      </div>

      <div className="arrival__layer arrival__journey">
        <SafeBoundary>
          <Journey ref={journey} />
        </SafeBoundary>
      </div>
    </section>
  );
}
