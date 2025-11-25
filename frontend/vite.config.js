import { defineConfig } from "vite";
import { resolve } from "path";


export default defineConfig(({ mode }) => ({
  appType: 'mpa',
  root: '.',               // โค้ดอยู่ในโฟลเดอร์ frontend
  base: mode === 'production'
    ? '/intproj25/pl1/itb-ecors/'  // ใช้ตอน build
    : '/',                         // ใช้ตอน dev // เว็บ deploy ใน subpath นี้
  build: {
    outDir: 'dist', // ออกผลลัพธ์นอกโฟลเดอร์ frontend
    rollupOptions: {
      input: {
        main: './index.html',
        reserve: './reserve.html'
      },
    },
  },
}))
