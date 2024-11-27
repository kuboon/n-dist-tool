import { defineConfig } from 'vite';
import vercel from 'vite-plugin-vercel';
import { viteStaticCopy } from 'vite-plugin-static-copy'


const dest = '../.vercel/output/functions/api/og.func';
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2022',
  },
  plugins: [
    vercel(),
    viteStaticCopy({
      targets: [
        { dest, src: '_api/_*.wasm' },
        { dest, src: '_api/_*.ttf' }
      ],
    })
  ],
});
