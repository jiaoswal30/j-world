import { useSyncExternalStore } from 'react';

/**
 * A small late-night jazz trio, synthesised live with Web Audio:
 * Rhodes comping a ii–V–I–VI, a walking upright bass, brushes and ride,
 * all under a layer of vinyl crackle. Original, file-free, ~76 bpm swing.
 */

const BPM = 76;
const BEAT = 60 / BPM;
const SWING = 0.64; // long-short eighths

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// rootless voicings + walking lines, one bar each
const BARS = [
  { chord: [53, 57, 60, 64], bass: [50, 48, 45, 44] }, // Dm9
  { chord: [53, 59, 64, 69], bass: [43, 47, 50, 49] }, // G13
  { chord: [52, 55, 59, 62], bass: [48, 47, 45, 46] }, // Cmaj9
  { chord: [55, 61, 64, 70], bass: [45, 49, 52, 51] }, // A7b9
];
const COMP = [
  [0, 3],
  [1, 4, 6],
];

type Listener = () => void;

class JazzEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private bus!: GainNode;
  private keys!: BiquadFilterNode;
  private noise!: AudioBuffer;
  private timer = 0;
  private nextTime = 0;
  private step = 0;
  private stopTimeout = 0;
  private listeners = new Set<Listener>();
  on = false;

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };
  private emit() {
    this.listeners.forEach((l) => l());
  }

  private setup() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const warmth = ctx.createBiquadFilter();
    warmth.type = 'lowpass';
    warmth.frequency.value = 5200;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    this.master.connect(warmth).connect(comp).connect(ctx.destination);

    // room
    const reverb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.4;
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    reverb.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.28;
    reverb.connect(wet).connect(this.master);

    this.bus = ctx.createGain();
    this.bus.connect(this.master);
    this.bus.connect(reverb);

    this.keys = ctx.createBiquadFilter();
    this.keys.type = 'lowpass';
    this.keys.frequency.value = 2400;
    this.keys.connect(this.bus);

    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = this.noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    // vinyl crackle bed
    const cl = ctx.sampleRate * 4;
    const crackle = ctx.createBuffer(1, cl, ctx.sampleRate);
    const cd = crackle.getChannelData(0);
    for (let i = 0; i < cl; i++) {
      let v = (Math.random() * 2 - 1) * 0.012;
      if (Math.random() < 0.0004) v += (Math.random() * 2 - 1) * 0.8;
      cd[i] = v;
    }
    const src = ctx.createBufferSource();
    src.buffer = crackle;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2600;
    bp.Q.value = 0.6;
    const cg = ctx.createGain();
    cg.gain.value = 0.5;
    src.connect(bp).connect(cg).connect(this.master);
    src.start();
  }

  start() {
    if (!this.ctx) this.setup();
    const ctx = this.ctx!;
    window.clearTimeout(this.stopTimeout);
    ctx.resume();
    if (!this.timer) {
      this.nextTime = ctx.currentTime + 0.12;
      this.timer = window.setInterval(() => this.schedule(), 25);
    }
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(0.62, ctx.currentTime, 0.5);
    this.on = true;
    this.emit();
  }

  stop() {
    const ctx = this.ctx;
    this.on = false;
    this.emit();
    if (!ctx) return;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
    this.stopTimeout = window.setTimeout(() => {
      window.clearInterval(this.timer);
      this.timer = 0;
      ctx.suspend();
    }, 1200);
  }

  toggle() {
    if (this.on) this.stop();
    else this.start();
  }

  private schedule() {
    const ctx = this.ctx!;
    while (this.nextTime < ctx.currentTime + 0.15) {
      this.play(this.step, this.nextTime);
      this.nextTime += BEAT * (this.step % 2 === 0 ? SWING : 1 - SWING);
      this.step = (this.step + 1) % (8 * BARS.length * 2);
    }
  }

  private play(step: number, t: number) {
    const barIdx = Math.floor(step / 8) % BARS.length;
    const pass = Math.floor(step / (8 * BARS.length));
    const e = step % 8; // eighth within bar
    const bar = BARS[barIdx];

    // walking bass on the beats
    if (e % 2 === 0) this.bass(bar.bass[e / 2], t, e === 0 ? 0.3 : 0.24);

    // Rhodes comping
    if (COMP[(barIdx + pass) % 2].includes(e)) {
      const vel = 0.75 + Math.random() * 0.25;
      bar.chord.forEach((n, i) => this.rhodes(n, t + i * 0.008, BEAT * 0.95, vel));
    }

    // ride: 1, 2, 2&, 3, 4, 4&
    if (e % 2 === 0 || e === 3 || e === 7) this.ride(t, e % 2 === 0 ? 0.05 : 0.035);
    // brush / foot hat on 2 and 4
    if (e === 2 || e === 6) this.brush(t);
    // feathered kick
    if (e === 0) this.kick(t);
  }

  private rhodes(m: number, t: number, dur: number, vel: number) {
    const ctx = this.ctx!;
    const f = mtof(m);
    const car = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    const amp = ctx.createGain();
    car.frequency.value = f;
    mod.frequency.value = f;
    modGain.gain.setValueAtTime(f * 1.4 * vel, t);
    modGain.gain.exponentialRampToValueAtTime(f * 0.12, t + 0.45);
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(0.055 * vel, t + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.02 * vel, t + dur);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.6);
    mod.connect(modGain).connect(car.frequency);
    car.connect(amp).connect(this.keys);
    car.start(t);
    mod.start(t);
    car.stop(t + dur + 0.7);
    mod.stop(t + dur + 0.7);
  }

  private bass(m: number, t: number, vel: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = mtof(m);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(900, t);
    lp.frequency.exponentialRampToValueAtTime(320, t + 0.3);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + BEAT * 0.98);
    o.connect(lp).connect(g).connect(this.bus);
    o.start(t);
    o.stop(t + BEAT);
  }

  private hit(t: number, type: BiquadFilterType, freq: number, q: number, gain: number, decay: number) {
    const ctx = this.ctx!;
    const s = ctx.createBufferSource();
    s.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    s.connect(f).connect(g).connect(this.bus);
    s.start(t, Math.random() * 0.5);
    s.stop(t + decay + 0.02);
  }

  private ride(t: number, vel: number) {
    this.hit(t, 'highpass', 7200, 0.7, vel, 0.42);
    this.hit(t, 'bandpass', 9400, 6, vel * 0.8, 0.6);
  }

  private brush(t: number) {
    this.hit(t, 'bandpass', 4200, 0.8, 0.05, 0.12);
  }

  private kick(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g).connect(this.bus);
    o.start(t);
    o.stop(t + 0.3);
  }
}

export const jazz = new JazzEngine();

// Background tabs throttle timers, which would smear the swing; pause and pick up again.
if (typeof document !== 'undefined') {
  let resumeOnReturn = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && jazz.on) {
      resumeOnReturn = true;
      jazz.stop();
    } else if (!document.hidden && resumeOnReturn) {
      resumeOnReturn = false;
      jazz.start();
    }
  });
}

export function useJazz() {
  return useSyncExternalStore(jazz.subscribe, () => jazz.on, () => false);
}
