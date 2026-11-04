import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

/**
 * Warm the opening shot: tell the browser about three.js, the globe and its first
 * texture straight from the HTML, so they download alongside the main bundle
 * instead of after it.
 */
function preloadOpening(): Plugin {
  return {
    name: 'preload-opening',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const chunks = Object.keys(ctx.bundle ?? {}).filter((f) => /^assets\/(three\.module|Globe)-.*\.js$/.test(f));
        return [
          ...chunks.map((f) => ({ tag: 'link', attrs: { rel: 'modulepreload', crossorigin: '', href: `./${f}` }, injectTo: 'head' as const })),
          {
            tag: 'link',
            attrs: { rel: 'preload', as: 'image', href: './earth/earth_atmos_1024.jpg', crossorigin: 'anonymous', fetchpriority: 'high' },
            injectTo: 'head' as const,
          },
        ];
      },
    },
  };
}

export default defineConfig({
  // relative base: the build works at a domain root or under a sub-path (e.g. GitHub Pages)
  base: './',
  plugins: [react(), preloadOpening()],
  build: {
    // vendor code changes rarely; split it so repeat visits hit the cache
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom'], gsap: ['gsap', '@gsap/react', 'lenis'] },
      },
    },
    chunkSizeWarningLimit: 700,
  },
  server: { port: 5173 },
});
