import { Plate } from './Plate';
import { Sparkle } from './Journey';

type Props = { src: string | null; alt: string };

/**
 * The portrait, cut through a four-point star in a mint poster —
 * the "Heels Class" edit, rebuilt in code so it stays sharp and animatable.
 */
export function StarCut({ src, alt }: Props) {
  return (
    <figure className="starcut" data-rise>
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <clipPath id="star-window" clipPathUnits="objectBoundingBox">
          <path d="M.52 0 C.57 .27 .7 .4 1 .47 C.7 .55 .58 .68 .44 1 C.41 .7 .28 .59 0 .56 C.3 .47 .45 .3 .52 0 Z" />
        </clipPath>
      </svg>

      <div className="starcut__poster">
        <span className="starcut__ticks starcut__ticks--l" aria-hidden="true" />
        <span className="starcut__ticks starcut__ticks--r" aria-hidden="true" />
        <p className="starcut__micro starcut__micro--tl">
          the person
          <br />
          by jia oswal
        </p>
        <p className="starcut__micro starcut__micro--tr">
          side a
          <br />
          track 01
        </p>

        <div className="starcut__window">
          <Plate src={src} alt={alt} ratio="1 / 1" tone="saffron" label="your portrait" />
        </div>

        <span className="starcut__script" aria-hidden="true">
          Jia
        </span>
        <span className="starcut__ghost" aria-hidden="true">
          curious
        </span>

        <span className="starcut__dot starcut__dot--a" aria-hidden="true" />
        <span className="starcut__dot starcut__dot--b" aria-hidden="true" />
        <span className="starcut__dot starcut__dot--c" aria-hidden="true" />
        <Sparkle className="starcut__spark" />

        <p className="starcut__info mono">
          Mesa School of Business
          <br />
          Bengaluru
        </p>
      </div>
      <figcaption className="starcut__caption">{src ? 'me, mid-thought' : 'your photo goes in the star — J.'}</figcaption>
    </figure>
  );
}
