import { defineConfig } from 'vite';
import { resolve } from 'path';

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
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        reserve: resolve(__dirname, 'reserve.html'),
      },
    },
  },
});
