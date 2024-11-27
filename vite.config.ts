import { defineConfig } from 'vite';
import vercel from 'vite-plugin-vercel';
import { viteStaticCopy } from 'vite-plugin-static-copy'


const dest = '../.vercel/output/functions/api/og.func';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vercel(),
    viteStaticCopy({
      targets: [
        { dest, src: '_api/_resvg.wasm' },
        { dest, src: '_api/_noto-sans-v27-latin-regular.ttf' }
      ],
    })
  ],
});
