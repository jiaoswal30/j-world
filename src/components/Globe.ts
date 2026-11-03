import * as THREE from 'three';
import { asset } from '../lib/asset';

/** Bengaluru. */
const LAT = THREE.MathUtils.degToRad(12.97);
const LON = THREE.MathUtils.degToRad(77.59);
/** Earth rotation that puts Bengaluru dead centre, facing the camera. */
const TARGET_YAW = -(Math.PI / 2 + LON);
const TARGET_PITCH = LAT;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const EARTH_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vPosW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D specMap;
  uniform vec3 sunDir;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float d = dot(n, sunDir);
    float dayMix = smoothstep(-0.18, 0.28, d);

    vec3 day = texture2D(dayMap, vUv).rgb;
    vec3 lit = day * (max(d, 0.0) * 0.95 + 0.02);

    // ocean glint
    float ocean = texture2D(specMap, vUv).r;
    vec3 h = normalize(sunDir + v);
    float spec = pow(max(dot(n, h), 0.0), 70.0) * ocean * 0.55;

    // city lights on the night side, warm sodium tone
    vec3 night = texture2D(nightMap, vUv).rgb;
    night = pow(night, vec3(1.25)) * vec3(1.0, 0.72, 0.42) * 2.4;

    vec3 col = lit + vec3(1.0, 0.92, 0.78) * spec * dayMix + night * (1.0 - dayMix);

    // atmospheric rim
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    col += vec3(0.32, 0.56, 1.0) * fres * (0.15 + 0.85 * smoothstep(-0.35, 0.45, d));

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const CLOUD_FRAG = /* glsl */ `
  uniform sampler2D cloudMap;
  uniform vec3 sunDir;
  uniform float fade;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec3 n = normalize(vNormalW);
    float d = dot(n, sunDir);
    float a = texture2D(cloudMap, vUv).a;
    float light = max(d, 0.0) * 1.05 + 0.04;
    gl_FragColor = vec4(vec3(light), a * 0.92 * fade);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const ATMO_VERT = /* glsl */ `
  varying vec3 vNormalV;
  void main() {
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ATMO_FRAG = /* glsl */ `
  varying vec3 vNormalV;
  void main() {
    float i = pow(0.68 - dot(vNormalV, vec3(0.0, 0.0, 1.0)), 3.2);
    gl_FragColor = vec4(0.36, 0.6, 1.0, 1.0) * i * 1.4;
  }
`;

function puffTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  for (let i = 0; i < 18; i++) {
    const x = 128 + (Math.random() - 0.5) * 120;
    const y = 128 + (Math.random() - 0.5) * 60;
    const r = 40 + Math.random() * 60;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(255,255,255,0.32)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * The opening shot: a real-texture Earth (NASA Blue Marble + city lights),
 * driven entirely by a 0–1 progress value from the scroll timeline.
 */
export class Globe {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1, 0.002, 100);
  private earth = new THREE.Group();
  private cloudMesh?: THREE.Mesh;
  private cloudMat?: THREE.ShaderMaterial;
  private puffs: THREE.Sprite[] = [];
  private progress = 0;
  private raf = 0;
  private running = false;
  private clock = new THREE.Clock();
  private idle = 0;
  private sunDir = new THREE.Vector3();
  private sunDay = new THREE.Vector3(-0.75, 0.3, 0.6).normalize();
  private sunDusk = new THREE.Vector3(-1, 0.22, -0.12).normalize();
  ready = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;
    this.renderer.setClearColor(0x05060c, 1);
    this.scene.add(this.earth);
    this.addStars();
  }

  async load() {
    const loader = new THREE.TextureLoader();
    const [day, night, spec, clouds] = await Promise.all(
      ['/earth/earth_atmos_2048.jpg', '/earth/earth_lights_2048.png', '/earth/earth_specular_2048.jpg', '/earth/earth_clouds_1024.png'].map((u) =>
        loader.loadAsync(asset(u)),
      ),
    );
    day.colorSpace = THREE.SRGBColorSpace;
    night.colorSpace = THREE.SRGBColorSpace;
    const aniso = this.renderer.capabilities.getMaxAnisotropy();
    [day, night, spec, clouds].forEach((t) => (t.anisotropy = aniso));

    // The sun sets as we descend: daylight on the opening frame, dusk over Bengaluru.
    const sunDir = this.sunDir;

    const earthMat = new THREE.ShaderMaterial({
      uniforms: { dayMap: { value: day }, nightMap: { value: night }, specMap: { value: spec }, sunDir: { value: sunDir } },
      vertexShader: EARTH_VERT,
      fragmentShader: EARTH_FRAG,
    });
    this.earth.add(new THREE.Mesh(new THREE.SphereGeometry(1, 160, 160), earthMat));

    this.cloudMat = new THREE.ShaderMaterial({
      uniforms: { cloudMap: { value: clouds }, sunDir: { value: sunDir }, fade: { value: 1 } },
      vertexShader: EARTH_VERT,
      fragmentShader: CLOUD_FRAG,
      transparent: true,
      depthWrite: false,
    });
    this.cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.012, 128, 128), this.cloudMat);
    this.earth.add(this.cloudMesh);

    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.09, 96, 96),
      new THREE.ShaderMaterial({
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    );
    this.scene.add(atmo);

    // Cloud banks the camera flies through on the way down to Bengaluru.
    const puff = puffTexture();
    for (let i = 0; i < 70; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff, transparent: true, depthWrite: false, opacity: 0 }));
      const z = 1.03 + Math.random() * 0.2;
      s.position.set((Math.random() - 0.5) * 0.34 * (z - 0.95) * 4, (Math.random() - 0.5) * 0.22 * (z - 0.95) * 4, z);
      const size = 0.05 + Math.random() * 0.09;
      s.scale.set(size * 1.8, size, 1);
      s.material.rotation = Math.random() * Math.PI;
      this.puffs.push(s);
      this.scene.add(s);
    }

    this.ready = true;
    this.render();
  }

  private addStars() {
    const n = 2400;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random() * 20);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xdfe6ff, size: 0.07, sizeAttenuation: true, transparent: true, opacity: 0.85 }));
    this.scene.add(stars);
  }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // keep the globe a consistent size on tall phones
    this.camera.fov = w / h < 0.8 ? 46 : 32;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  setProgress(p: number) {
    this.progress = p;
    if (!this.running) this.render();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
    const loop = () => {
      if (!this.running) return;
      this.idle += this.clock.getDelta() * 0.06;
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private render() {
    if (!this.ready) {
      this.renderer.render(this.scene, this.camera);
      return;
    }
    const p = this.progress;
    // k: how far we've turned to face Bengaluru
    const k = smooth(0.06, 0.6, p);
    const free = 1 - k;

    this.earth.rotation.set(lerp(0.08, TARGET_PITCH, k), TARGET_YAW - 2.2 * free + this.idle * free, 0.28 * free);
    if (this.cloudMesh) this.cloudMesh.rotation.y = this.idle * 0.18 * free + 0.02;

    this.sunDir.copy(this.sunDay).lerp(this.sunDusk, smooth(0.05, 0.55, p)).normalize();

    // dolly: far → orbit → just above the cloud deck
    const near = smooth(0.55, 0.9, p);
    const dist = lerp(lerp(5.4, 1.55, smooth(0.04, 0.58, p)), 1.03, near);
    const lift = 0.5 * (1 - smooth(0.02, 0.4, p));
    this.camera.position.set(0, lift, dist);
    this.camera.lookAt(0, lift, 0);

    // fade the cloud sphere as we enter it; bring up the puffs
    if (this.cloudMat) this.cloudMat.uniforms.fade.value = 1 - smooth(0.72, 0.86, p) * 0.7;
    const puffs = smooth(0.58, 0.7, p) * (1 - smooth(0.9, 0.97, p));
    for (const s of this.puffs) s.material.opacity = puffs * 0.9;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
    });
    this.renderer.dispose();
  }
}
