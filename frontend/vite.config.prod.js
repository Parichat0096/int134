import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/intproj25/pl1/itb-ecors/',

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
