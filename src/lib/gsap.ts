import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, Flip, SplitText, Draggable, InertiaPlugin, ScrambleTextPlugin, useGSAP);

// Mobile address bars resize the viewport constantly; don't re-measure pins for that.
ScrollTrigger.config({ ignoreMobileResize: true });

gsap.defaults({ ease: 'power3.out', duration: 0.8 });

export { gsap, ScrollTrigger, Flip, SplitText, Draggable, InertiaPlugin, useGSAP };
