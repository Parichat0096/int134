import { defineConfig } from 'vite';

export default defineConfig({
  base: '/intproj25/pl1/itb-ecors/',
  server: {
    port: 5173,
    proxy: {
      '/intproj25/pl1/itb-ecors/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
