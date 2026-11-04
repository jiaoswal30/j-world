import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
 * The Listening Room, in 3D. A night-time glass storefront in Bengaluru,
 * doors that swing in, and a green-lacquered listening bar inside.
 * Everything is driven by one progress value (0 = outside, 1 = at the bar),
 * plus the turntable state the record-play sequence animates.
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const PAL = {
  ink: '#1C1512',
  paper: '#EFE7D6',
  oxblood: '#5E1A1F',
  saffron: '#E0A43A',
  cobalt: '#2335C8',
  celadon: '#A9BCA0',
  mint: '#A8EDE2',
  blush: '#ECC5C8',
  denim: '#2B3A5C',
  green: '#34432C',
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, srgb = true) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Original record-sleeve art, drawn procedurally. */
function sleeveTexture(seed: number) {
  const r = rng(seed);
  const cols = [PAL.saffron, PAL.cobalt, PAL.oxblood, PAL.celadon, PAL.paper, PAL.ink, PAL.mint, PAL.blush, PAL.denim];
  const pick = () => cols[Math.floor(r() * cols.length)];
  return canvasTexture(256, 256, (g) => {
    const bg = pick();
    g.fillStyle = bg;
    g.fillRect(0, 0, 256, 256);
    const kind = Math.floor(r() * 5);
    let fg = pick();
    while (fg === bg) fg = pick();
    g.fillStyle = fg;
    if (kind === 0) {
      g.beginPath();
      g.arc(128 + (r() - 0.5) * 60, 120, 70 + r() * 30, 0, Math.PI * 2);
      g.fill();
    } else if (kind === 1) {
      g.fillRect(0, 140 + r() * 40, 256, 120);
    } else if (kind === 2) {
      for (let i = 0; i < 6; i++) g.fillRect(0, 20 + i * 40, 256, 16);
    } else if (kind === 3) {
      g.beginPath();
      g.arc(0, 256, 180, -Math.PI / 2, 0);
      g.lineTo(0, 256);
      g.fill();
    } else {
      g.font = '150px Gloock, serif';
      g.fillText(String.fromCharCode(65 + Math.floor(r() * 26)), 40, 200);
    }
    g.fillStyle = 'rgba(0,0,0,.18)';
    g.fillRect(0, 0, 256, 3);
  });
}

function terrazzoTexture() {
  const r = rng(11);
  const t = canvasTexture(1024, 1024, (g) => {
    g.fillStyle = '#E4DACB';
    g.fillRect(0, 0, 1024, 1024);
    const flecks = ['#B9AC97', '#8C7E6A', '#6E7B5E', '#C07A55', '#F4EEE3', '#4A4038'];
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = flecks[Math.floor(r() * flecks.length)];
      const x = r() * 1024;
      const y = r() * 1024;
      const s = 2 + r() * (r() < 0.08 ? 14 : 6);
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + s, y + r() * s);
      g.lineTo(x + r() * s, y + s);
      g.closePath();
      g.fill();
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, 5);
  return t;
}

function walnutTexture() {
  const r = rng(5);
  const t = canvasTexture(512, 512, (g) => {
    g.fillStyle = '#5B3725';
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 160; i++) {
      const y = r() * 512;
      g.strokeStyle = r() < 0.5 ? 'rgba(30,15,8,.35)' : 'rgba(150,95,60,.25)';
      g.lineWidth = 0.6 + r() * 2.4;
      g.beginPath();
      g.moveTo(0, y);
      for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x * 0.02 + i) * 4 + (r() - 0.5) * 2);
      g.stroke();
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function grooveTexture() {
  return canvasTexture(512, 512, (g) => {
    g.fillStyle = '#121010';
    g.fillRect(0, 0, 512, 512);
    for (let rr = 80; rr < 256; rr += 1.6) {
      g.strokeStyle = rr % 9 < 1.6 ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.025)';
      g.beginPath();
      g.arc(256, 256, rr, 0, Math.PI * 2);
      g.stroke();
    }
    const grd = g.createLinearGradient(0, 0, 512, 512);
    grd.addColorStop(0.35, 'rgba(255,255,255,0)');
    grd.addColorStop(0.5, 'rgba(201,184,232,.12)');
    grd.addColorStop(0.65, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.beginPath();
    g.arc(256, 256, 256, 0, Math.PI * 2);
    g.fill();
  });
}

function labelTexture(color: string, ink: string, code: string, title: string) {
  return canvasTexture(256, 256, (g) => {
    g.fillStyle = color;
    g.beginPath();
    g.arc(128, 128, 128, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = ink;
    g.textAlign = 'center';
    g.font = '64px Gloock, serif';
    g.fillText(code, 128, 100);
    g.font = '15px "IBM Plex Mono", monospace';
    g.fillText(title.toUpperCase().slice(0, 22), 128, 190);
    g.fillStyle = '#0c0a09';
    g.beginPath();
    g.arc(128, 128, 9, 0, Math.PI * 2);
    g.fill();
  });
}

function signTexture() {
  return canvasTexture(2048, 256, (g) => {
    g.fillStyle = '#100b09';
    g.fillRect(0, 0, 2048, 256);
    const gold = g.createLinearGradient(0, 40, 0, 210);
    gold.addColorStop(0, '#F8E2A0');
    gold.addColorStop(0.5, '#D99C3C');
    gold.addColorStop(1, '#F3D387');
    g.strokeStyle = gold;
    g.lineWidth = 4;
    g.strokeRect(18, 18, 2012, 220);
    g.fillStyle = gold;
    g.textAlign = 'center';
    g.font = '132px Gloock, serif';
    g.fillText('THE  LISTENING  ROOM', 1024, 172);
    g.font = '28px "IBM Plex Mono", monospace';
    g.textAlign = 'left';
    g.fillText('Nº 01', 70, 140);
    g.textAlign = 'right';
    g.fillText('BENGALURU', 1978, 140);
  });
}

function posterTexture() {
  return canvasTexture(512, 700, (g) => {
    g.fillStyle = '#EDE6D6';
    g.fillRect(0, 0, 512, 700);
    g.fillStyle = PAL.ink;
    g.textAlign = 'center';
    g.font = '40px Gloock, serif';
    g.fillText("JIA'S WORLD", 256, 90);
    g.font = '15px "IBM Plex Mono", monospace';
    g.fillText('THE LISTENING ROOM · VOL. 01', 256, 124);
    g.fillStyle = PAL.cobalt;
    g.beginPath();
    g.arc(256, 380, 170, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = PAL.ink;
    g.font = '14px "IBM Plex Mono", monospace';
    g.fillText('SIDE A  ·  SIDE B  ·  BENGALURU', 256, 640);
  });
}

/** Turntable state shared with the record-play sequence (plain objects GSAP can tween). */
export type DeckState = { arm: { rotation: number }; record: { autoAlpha: number }; spin: { rot: number } };

type Mats = Record<string, THREE.Material>;

export class Store3D {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(42, 1, 0.05, 80);
  private progress = 0;
  private raf = 0;
  private running = false;
  private doors: THREE.Object3D[] = [];
  private platterAnchor = new THREE.Object3D();
  private recordGroup = new THREE.Group();
  private recordDisc!: THREE.Mesh;
  private labelMesh!: THREE.Mesh;
  private armPivot = new THREE.Group();
  private secondRecord = new THREE.Group();
  private portrait = false;
  private built = false;
  private mobile: boolean;
  private platterEl: HTMLElement;
  private armState: DeckState['arm'];
  private recordState: DeckState['record'];
  private spinState: DeckState['spin'];

  constructor(
    private canvas: HTMLCanvasElement,
    platterEl: HTMLElement,
    deck: DeckState,
  ) {
    this.platterEl = platterEl;
    this.armState = deck.arm;
    this.recordState = deck.record;
    this.spinState = deck.spin;
    this.mobile = window.matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)').matches;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.mobile ? 1.5 : 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.renderer.shadowMap.enabled = !this.mobile;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.background = new THREE.Color('#0A0C15');
    this.scene.fog = new THREE.Fog('#0A0C15', 14, 34);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.55;
    pmrem.dispose();
  }

  /** Build after fonts are ready so canvas lettering uses the real faces. */
  async build() {
    try {
      await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 2500))]);
    } catch {
      /* fonts are a nicety */
    }
    const m = this.materials();
    this.buildRoom(m);
    this.buildShelves(m, -4.35, -1.25, 3);
    this.buildShelves(m, 1.25, 4.35, 17);
    this.buildBar(m);
    this.buildFacade(m);
    this.buildStreet(m);
    this.buildLights();
    this.built = true;
    this.render();
  }

  private materials(): Mats {
    const walnut = walnutTexture();
    return {
      green: new THREE.MeshStandardMaterial({ color: PAL.green, roughness: 0.26, metalness: 0.08, envMapIntensity: 0.45 }),
      greenDark: new THREE.MeshStandardMaterial({ color: '#2C3A28', roughness: 0.4, envMapIntensity: 0.5 }),
      plaster: new THREE.MeshStandardMaterial({ color: '#D9CDB4', roughness: 0.9, envMapIntensity: 0.3 }),
      ceiling: new THREE.MeshStandardMaterial({ color: '#1A1512', roughness: 0.95 }),
      walnut: new THREE.MeshStandardMaterial({ map: walnut, roughness: 0.42, metalness: 0.02, envMapIntensity: 0.55 }),
      walnutTop: new THREE.MeshStandardMaterial({ map: walnut, color: '#E2C2A6', roughness: 0.28, envMapIntensity: 0.8 }),
      terrazzo: new THREE.MeshStandardMaterial({ map: terrazzoTexture(), roughness: 0.32, envMapIntensity: 0.55 }),
      chrome: new THREE.MeshStandardMaterial({ color: '#E8E6E2', metalness: 1, roughness: 0.14, envMapIntensity: 1.2 }),
      brushed: new THREE.MeshStandardMaterial({ color: '#C9C5BC', metalness: 0.85, roughness: 0.32, envMapIntensity: 1 }),
      brass: new THREE.MeshStandardMaterial({ color: '#C79A4A', metalness: 1, roughness: 0.28, envMapIntensity: 1 }),
      black: new THREE.MeshStandardMaterial({ color: '#141110', roughness: 0.5 }),
      cushion: new THREE.MeshStandardMaterial({ color: '#8E9468', roughness: 0.8 }),
      led: new THREE.MeshStandardMaterial({ color: '#FFE2B0', emissive: '#FFC97A', emissiveIntensity: 2.6 }),
      glass: new THREE.MeshStandardMaterial({ color: '#F6E3C2', transparent: true, opacity: 0.12, roughness: 0.04, metalness: 0.2, envMapIntensity: 1.6, depthWrite: false }),
      facade: new THREE.MeshStandardMaterial({ color: '#1F2B21', roughness: 0.38, envMapIntensity: 0.5 }),
      asphalt: new THREE.MeshStandardMaterial({ color: '#1A1A1F', roughness: 0.85 }),
      pavement: new THREE.MeshStandardMaterial({ color: '#3B3631', roughness: 0.8 }),
    };
  }

  private box(w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, opts: { cast?: boolean; receive?: boolean; parent?: THREE.Object3D } = {}) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = !!opts.cast;
    mesh.receiveShadow = opts.receive !== false;
    (opts.parent ?? this.scene).add(mesh);
    return mesh;
  }

  private buildRoom(m: Mats) {
    // floor, ceiling, walls — interior spans x ±4.6, z −2 … 5.5
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(9.2, 7.5), m.terrazzo);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 1.75);
    floor.receiveShadow = true;
    this.scene.add(floor);
    this.box(9.2, 0.1, 7.5, m.ceiling, 0, 3.45, 1.75);
    this.box(9.2, 3.5, 0.1, m.green, 0, 1.75, -2.05);
    this.box(0.1, 3.5, 7.5, m.green, -4.6, 1.75, 1.75);
    this.box(0.1, 3.5, 7.5, m.green, 4.6, 1.75, 1.75);
    // track rails
    [-2.2, 0, 2.2].forEach((x) => {
      this.box(0.04, 0.04, 6.6, m.black, x, 3.36, 1.6, { receive: false });
      [0, 1.6, 3.2].forEach((z) => {
        const can = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.16, 16), m.black);
        can.position.set(x, 3.26, z);
        this.scene.add(can);
      });
    });
    // poster above the bar
    const poster = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.37), new THREE.MeshStandardMaterial({ map: posterTexture(), roughness: 0.85 }));
    poster.position.set(0, 2.25, -1.96); // in front of its frame (no z-fighting)
    this.scene.add(poster);
    this.box(1.06, 1.43, 0.03, m.black, 0, 2.25, -1.99);
    // plant in the corner
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.5, 24), new THREE.MeshStandardMaterial({ color: '#7E2A2C', roughness: 0.6 }));
    pot.position.set(3.7, 0.25, 3.2);
    pot.castShadow = true;
    this.scene.add(pot);
    const leafMat = new THREE.MeshStandardMaterial({ color: '#3E5A3F', roughness: 0.6, side: THREE.DoubleSide });
    const r = rng(42);
    for (let i = 0; i < 16; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), leafMat);
      leaf.scale.set(1, 0.18, 0.5);
      const a = (i / 16) * Math.PI * 2;
      leaf.position.set(3.7 + Math.cos(a) * 0.28, 0.75 + r() * 0.9, 3.2 + Math.sin(a) * 0.28);
      leaf.rotation.set(r() - 0.5, a, 0.6 + r() * 0.5);
      leaf.castShadow = true;
      this.scene.add(leaf);
    }
  }

  /** Green-lacquer cubbies with LED strips, face-out sleeves and spine rows. */
  private buildShelves(m: Mats, x0: number, x1: number, seed: number) {
    const r = rng(seed);
    const back = -2.0;
    const depth = 0.38;
    const zc = back + depth / 2;
    const cols = 3;
    const rows = 3;
    const y0 = 1.05;
    const cellH = 0.66;
    const cellW = (x1 - x0) / cols;
    // lower cabinet
    this.box(x1 - x0, 1.0, depth + 0.04, m.green, (x0 + x1) / 2, 0.5, zc + 0.02, { cast: true });
    this.box(x1 - x0, 0.02, 0.02, m.brass, (x0 + x1) / 2, 0.98, back + depth + 0.05);
    for (let c = 0; c <= cols; c++) this.box(0.035, rows * cellH, depth, m.green, x0 + c * cellW, y0 + (rows * cellH) / 2, zc);
    for (let rr = 0; rr <= rows; rr++) this.box(x1 - x0 + 0.035, 0.035, depth, m.green, (x0 + x1) / 2, y0 + rr * cellH, zc);
    const spineCols = ['#2A1E19', '#4A2E21', '#6B4430', '#5E1A1F', '#D8CDB4', '#B79A74', '#1C1512', '#E6DCC6', '#4E6151'];
    for (let c = 0; c < cols; c++) {
      for (let rr = 0; rr < rows; rr++) {
        const cx = x0 + (c + 0.5) * cellW;
        const by = y0 + rr * cellH + 0.02;
        // LED strip under the top of each cubby
        this.box(cellW - 0.08, 0.012, 0.02, m.led, cx, by + cellH - 0.05, back + depth - 0.04, { receive: false });
        if ((c + rr + seed) % 2 === 0) {
          const s = 0.42;
          const sleeve = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshStandardMaterial({ map: sleeveTexture(seed * 31 + c * 7 + rr), roughness: 0.6 }));
          sleeve.position.set(cx + (r() - 0.5) * 0.2, by + s / 2 + 0.02, back + 0.12);
          sleeve.rotation.x = -0.07;
          sleeve.castShadow = true;
          this.scene.add(sleeve);
          for (let k = 0; k < 5; k++) {
            const h = 0.32 + r() * 0.08;
            this.box(0.016, h, 0.3, new THREE.MeshStandardMaterial({ color: spineCols[Math.floor(r() * spineCols.length)], roughness: 0.7 }), cx - cellW / 2 + 0.08 + k * 0.02, by + h / 2, back + 0.17);
          }
        } else {
          let x = cx - cellW / 2 + 0.06;
          while (x < cx + cellW / 2 - 0.08) {
            const w = 0.012 + r() * 0.012;
            const h = cellH - 0.16 - r() * 0.1;
            this.box(w, h, 0.31, new THREE.MeshStandardMaterial({ color: spineCols[Math.floor(r() * spineCols.length)], roughness: 0.7 }), x, by + h / 2, back + 0.17);
            x += w + 0.002;
          }
        }
      }
    }
  }

  private buildTurntable(m: Mats, x: number, main: boolean) {
    const g = new THREE.Group();
    g.position.set(x, 1.075, 0.3);
    // the hero deck is a statement piece: big enough that the record you pick visibly lands on it
    g.scale.setScalar(main ? 1.6 : 1.15);
    this.scene.add(g);
    this.box(0.5, 0.075, 0.38, m.brushed, 0, 0.0375, 0, { cast: true, parent: g });
    this.box(0.5, 0.012, 0.38, m.black, 0, 0.081, 0, { parent: g });
    const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.02, 64), m.brushed);
    platter.position.set(-0.06, 0.095, 0);
    platter.castShadow = true;
    g.add(platter);
    // the record
    const rec = main ? this.recordGroup : this.secondRecord;
    rec.position.set(-0.06, 0.107, 0);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.148, 64), new THREE.MeshStandardMaterial({ map: grooveTexture(), roughness: 0.25, metalness: 0.2, envMapIntensity: 1.2, transparent: true }));
    disc.rotation.x = -Math.PI / 2;
    rec.add(disc);
    const label = new THREE.Mesh(
      new THREE.CircleGeometry(0.05, 48),
      new THREE.MeshStandardMaterial({ map: labelTexture(main ? PAL.cobalt : PAL.saffron, main ? PAL.paper : PAL.ink, main ? 'TLR' : 'B2', 'House record'), roughness: 0.7, transparent: true }),
    );
    label.rotation.x = -Math.PI / 2;
    label.position.y = 0.001;
    rec.add(label);
    g.add(rec);
    if (main) {
      this.recordDisc = disc;
      this.labelMesh = label;
      this.platterAnchor.position.set(-0.06, 0.107, 0);
      g.add(this.platterAnchor);
    }
    // tonearm: pivot at the back right, swings over the record
    const pivot = main ? this.armPivot : new THREE.Group();
    pivot.position.set(0.17, 0.11, -0.12);
    g.add(pivot);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.04, 24), m.chrome);
    pivot.add(base);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.27, 12), m.chrome);
    rod.rotation.x = Math.PI / 2;
    rod.position.set(0, 0.02, 0.135);
    pivot.add(rod);
    this.box(0.03, 0.012, 0.04, m.black, 0, 0.016, 0.27, { parent: pivot });
    pivot.rotation.y = THREE.MathUtils.degToRad(main ? 30 : 34) * 0.9;
    // knobs
    [-0.19, -0.13].forEach((kx) => {
      const k = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.01, 16), m.chrome);
      k.position.set(kx, 0.085, 0.15);
      g.add(k);
    });
  }

  private buildBar(m: Mats) {
    // the walnut listening bar
    const bar = new THREE.Mesh(new RoundedBoxGeometry(3.9, 1.02, 0.72, 4, 0.09), m.walnut);
    bar.position.set(0, 0.51, 0.3);
    bar.castShadow = bar.receiveShadow = true;
    this.scene.add(bar);
    const top = new THREE.Mesh(new RoundedBoxGeometry(4.02, 0.06, 0.84, 4, 0.025), m.walnutTop);
    top.position.set(0, 1.05, 0.3);
    top.castShadow = top.receiveShadow = true;
    this.scene.add(top);
    this.box(3.86, 0.04, 0.02, m.chrome, 0, 0.06, 0.67);
    this.buildTurntable(m, 0.0, true);
    this.buildTurntable(m, -1.15, false);
    // a short stack of sleeves on the bar
    for (let i = 0; i < 4; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.008, 0.32), new THREE.MeshStandardMaterial({ map: sleeveTexture(90 + i), roughness: 0.6 }));
      s.position.set(0.95 + i * 0.006, 1.085 + i * 0.009, 0.28);
      s.rotation.y = (i - 1.5) * 0.08;
      s.castShadow = true;
      this.scene.add(s);
    }
    // mushroom lamp
    const lamp = new THREE.Group();
    lamp.position.set(1.55, 1.08, 0.25);
    this.scene.add(lamp);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.015, 32), m.chrome);
    lamp.add(foot);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 16), m.chrome);
    stem.position.y = 0.14;
    lamp.add(stem);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: '#FFF4DE', emissive: '#FFD9A0', emissiveIntensity: 1.4, roughness: 0.4 }),
    );
    dome.position.y = 0.28;
    lamp.add(dome);
    const glow = new THREE.PointLight('#FFC57A', 2.2, 3.5, 2);
    glow.position.set(1.55, 1.3, 0.35);
    this.scene.add(glow);
    // chrome stools
    [-0.95, 0.95].forEach((x) => {
      const st = new THREE.Group();
      st.position.set(x, 0, 1.25);
      this.scene.add(st);
      const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.03, 32), m.chrome);
      baseDisc.position.y = 0.015;
      st.add(baseDisc);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.68, 16), m.chrome);
      pole.position.y = 0.36;
      st.add(pole);
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.18, 0.09, 32), m.cushion);
      seat.position.y = 0.74;
      seat.castShadow = true;
      st.add(seat);
      st.traverse((o) => (o.castShadow = true));
    });
  }

  /** The night-time shopfront at z = 5.5: glass windows, a gilded sign, glass doors. */
  private buildFacade(m: Mats) {
    const z = 5.5;
    const T = 0.22;
    this.box(9.6, 0.62, T, m.facade, 0, 0.31, z);
    this.box(9.6, 1.5, T, m.facade, 0, 3.6, z);
    this.box(0.62, 2.6, T, m.facade, -4.49, 1.92, z);
    this.box(0.62, 2.6, T, m.facade, 4.49, 1.92, z);
    this.box(0.42, 2.6, T, m.facade, -0.91, 1.92, z);
    this.box(0.42, 2.6, T, m.facade, 0.91, 1.92, z);
    this.box(1.4, 0.36, T, m.facade, 0, 2.67, z);
    // brass trims
    this.box(9.6, 0.03, 0.04, m.brass, 0, 0.62, z + 0.13);
    this.box(9.6, 0.03, 0.04, m.brass, 0, 2.86, z + 0.13);
    // windows
    [-2.45, 2.45].forEach((x) => {
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.24), m.glass);
      pane.position.set(x, 1.74, z);
      this.scene.add(pane);
      // display ledge with sleeves behind the glass
      this.box(3.1, 0.06, 0.4, m.walnutTop, x, 0.66, z - 0.3);
      for (let i = 0; i < 4; i++) {
        const s = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46), new THREE.MeshStandardMaterial({ map: sleeveTexture(200 + i + (x > 0 ? 10 : 0)), roughness: 0.6 }));
        s.position.set(x - 1.1 + i * 0.73, 0.94, z - 0.35);
        s.rotation.y = (i - 1.5) * 0.06;
        this.scene.add(s);
      }
    });
    // sign
    const signTex = signTexture();
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 0.65),
      new THREE.MeshStandardMaterial({ map: signTex, emissive: '#ffffff', emissiveMap: signTex, emissiveIntensity: 0.55, roughness: 0.5 }),
    );
    sign.position.set(0, 3.3, z + 0.12);
    this.scene.add(sign);
    // the glass doors, hinged at the jambs
    [-1, 1].forEach((side) => {
      const hinge = new THREE.Group();
      hinge.position.set(side * -0.7, 0, z);
      this.scene.add(hinge);
      const leaf = new THREE.Group();
      leaf.position.set(side * 0.35, 0, 0);
      hinge.add(leaf);
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 2.34), m.glass);
      pane.position.y = 1.25;
      leaf.add(pane);
      this.box(0.7, 0.05, 0.05, m.brass, 0, 0.04, 0, { parent: leaf });
      this.box(0.7, 0.05, 0.05, m.brass, 0, 2.45, 0, { parent: leaf });
      this.box(0.04, 2.45, 0.05, m.brass, -0.33, 1.24, 0, { parent: leaf });
      this.box(0.04, 2.45, 0.05, m.brass, 0.33, 1.24, 0, { parent: leaf });
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 12), m.brass);
      handle.position.set(side * 0.24, 1.15, 0.06);
      leaf.add(handle);
      (hinge.userData as { side: number }).side = side;
      this.doors.push(hinge);
    });
  }

  private buildStreet(m: Mats) {
    const pave = new THREE.Mesh(new THREE.PlaneGeometry(30, 3), m.pavement);
    pave.rotation.x = -Math.PI / 2;
    pave.position.set(0, 0.001, 7.1);
    pave.receiveShadow = true;
    this.scene.add(pave);
    const road = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), m.asphalt);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, -0.02, 18.5);
    this.scene.add(road);
    this.box(30, 0.12, 0.2, m.pavement, 0, 0.04, 8.6);
    // neighbouring walls so the shop sits in a street, not a void
    this.box(6, 6, 0.4, new THREE.MeshStandardMaterial({ color: '#191621', roughness: 0.9 }), -7.9, 3, 5.5);
    this.box(6, 5, 0.4, new THREE.MeshStandardMaterial({ color: '#16141D', roughness: 0.9 }), 7.9, 2.5, 5.5);
    this.box(9.6, 3, 0.4, m.facade, 0, 5.85, 5.5);
    // street lamp
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 4.2, 12), m.black);
    pole.position.set(-3.6, 2.1, 8.3);
    this.scene.add(pole);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshStandardMaterial({ color: '#FFE6B8', emissive: '#FFD38A', emissiveIntensity: 3 }));
    bulb.position.set(-3.6, 4.25, 8.3);
    this.scene.add(bulb);
    const sl = new THREE.PointLight('#FFC98A', 6, 9, 2);
    sl.position.set(-3.6, 4.1, 8.3);
    this.scene.add(sl);
  }

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight('#FFE3BD', '#120D0A', 0.12));
    const spot = (x: number, z: number, tx: number, ty: number, tz: number, intensity: number, shadow: boolean) => {
      const s = new THREE.SpotLight('#FFD7A1', intensity, 9, 0.62, 0.65, 1.6);
      s.position.set(x, 3.25, z);
      s.target.position.set(tx, ty, tz);
      s.castShadow = shadow && !this.mobile;
      s.shadow.mapSize.set(1024, 1024);
      s.shadow.bias = -0.0004;
      this.scene.add(s, s.target);
    };
    spot(-2.8, 1.4, -2.8, 1.5, -2.0, 34, false);
    spot(2.8, 1.4, 2.8, 1.5, -2.0, 34, false);
    spot(0, 1.2, 0, 1.0, 0.3, 46, true);
    spot(0, 2.6, 0, 2.3, -2.0, 18, false);
    // warm wash that spills out of the windows at night
    const spill = new THREE.PointLight('#FFB868', 10, 7, 2);
    spill.position.set(0, 2.2, 4.4);
    this.scene.add(spill);
  }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.portrait = w / h < 0.8;
    this.camera.fov = this.portrait ? 64 : 40;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  setProgress(p: number) {
    this.progress = p;
    if (!this.running) this.render();
  }

  /** New record on the platter. */
  setLabel(color: string, ink: string, code: string, title: string) {
    const mat = this.labelMesh.material as THREE.MeshStandardMaterial;
    mat.map?.dispose();
    mat.map = labelTexture(color, ink, code, title);
    mat.needsUpdate = true;
    if (!this.running) this.render();
  }

  /** Draw one frame now (used when turntable state changes while the loop is idle). */
  renderNow() {
    if (!this.running) this.render();
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private camPose(p: number) {
    // outside → through the doors → at the bar
    const far = this.portrait ? 14 : 12.6;
    // portrait: close on the hero deck so it sits in the clear band between the card and the record rail
    const end = this.portrait ? new THREE.Vector3(0.05, 2.0, 2.15) : new THREE.Vector3(0.5, 2.3, 4.45);
    const a = new THREE.Vector3(0, 1.8, far);
    const b = new THREE.Vector3(0, 1.62, 6.7);
    const la = new THREE.Vector3(0, 2.0, 5.5);
    const lb = new THREE.Vector3(0, 1.45, 0);
    const lc = this.portrait ? new THREE.Vector3(0, 1.22, 0.25) : new THREE.Vector3(0, 1.12, 0.05);
    const k1 = smooth(0, 0.55, p);
    const k2 = smooth(0.5, 1, p);
    const pos = a.clone().lerp(b, k1).lerp(end, k2);
    const look = la.clone().lerp(lb, k1).lerp(lc, k2);
    return { pos, look };
  }

  private render() {
    if (!this.built) return; // resize/scroll can arrive while the scene is still being assembled
    const p = this.progress;
    const { pos, look } = this.camPose(p);
    this.camera.position.copy(pos);
    this.camera.lookAt(look);

    const open = smooth(0.16, 0.48, p) * THREE.MathUtils.degToRad(96);
    for (const d of this.doors) d.rotation.y = -(d.userData as { side: number }).side * open;

    // turntable state from the record-play sequence
    this.armPivot.rotation.y = THREE.MathUtils.degToRad(this.armState.rotation) * 0.9;
    this.recordGroup.rotation.y = -THREE.MathUtils.degToRad(this.spinState.rot);
    this.secondRecord.rotation.y = -THREE.MathUtils.degToRad(this.spinState.rot * 0.4);
    const a = this.recordState.autoAlpha;
    this.recordGroup.visible = a > 0.01;
    (this.recordDisc.material as THREE.MeshStandardMaterial).opacity = a;
    (this.labelMesh.material as THREE.MeshStandardMaterial).opacity = a;

    this.renderer.render(this.scene, this.camera);
    this.placePlatter();
  }

  /** Keep a DOM proxy over the platter so the flying vinyl knows where to land. */
  private placePlatter() {
    const c = this.platterAnchor.getWorldPosition(new THREE.Vector3());
    const R = 0.148 * 1.6; // record radius × the hero deck's scale
    const pts = [c.clone().add(new THREE.Vector3(-R, 0, 0)), c.clone().add(new THREE.Vector3(R, 0, 0)), c.clone().add(new THREE.Vector3(0, 0, -R)), c.clone().add(new THREE.Vector3(0, 0, R))];
    const rect = this.canvas.getBoundingClientRect();
    const xs: number[] = [];
    const ys: number[] = [];
    for (const v of pts) {
      v.project(this.camera);
      xs.push((v.x * 0.5 + 0.5) * rect.width);
      ys.push((-v.y * 0.5 + 0.5) * rect.height);
    }
    const s = this.platterEl.style;
    s.left = `${Math.min(...xs)}px`;
    s.top = `${Math.min(...ys)}px`;
    s.width = `${Math.max(...xs) - Math.min(...xs)}px`;
    s.height = `${Math.max(...ys) - Math.min(...ys)}px`;
  }

  dispose() {
    this.stop();
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((mm) => {
        (mm as THREE.MeshStandardMaterial).map?.dispose();
        mm.dispose();
      });
    });
    this.scene.environment?.dispose();
    this.renderer.dispose();
  }
}
