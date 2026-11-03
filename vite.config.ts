import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // relative base: the build works at a domain root or under a sub-path (e.g. GitHub Pages)
  base: './',
  plugins: [react()],
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
