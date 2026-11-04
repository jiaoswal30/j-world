/** True if this browser can create a WebGL context (checked once, before loading three.js). */
let cached: boolean | null = null;
export function hasWebGL() {
  if (cached !== null) return cached;
  try {
    const c = document.createElement('canvas');
    cached = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    cached = false;
  }
  return cached;
}
