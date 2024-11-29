import { type UserConfig } from 'vite';
import vercel from 'vite-plugin-vercel';
import { viteStaticCopy } from 'vite-plugin-static-copy'


const apiDir = '../.vercel/output/functions/api';
// https://vitejs.dev/config/
export default {
  build: {
    rollupOptions: {
      input: {
        root: '_index.html'
      }
    },
    target: 'es2022',
  },

  plugins: [
    vercel(),
    viteStaticCopy({
      targets: [
        { dest: apiDir + '/og.func', src: 'node_modules/svg2png-wasm/svg2png_wasm_bg.wasm' },
        { dest: apiDir + '/og.func', src: '_api/_*.ttf' },
        { dest: apiDir + '/og_image_rewriter.func', src: 'dist/_index.html' }
      ],
    })
  ],
  vercel: {
    rewrites: [
      {
        "source": "/",
        "destination": "/api/og_image_rewriter"
      }
    ]
  }
} satisfies UserConfig
