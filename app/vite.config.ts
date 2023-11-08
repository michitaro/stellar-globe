import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { visualizer } from 'rollup-plugin-visualizer'
// @ts-ignore
import secrets from './secrets.json'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ gzipSize: true }),
  ],
  build: {
    outDir: "build",
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    }
  },
  server: {
    proxy: {
      '/data/s23b_wide/': {
        target: 'https://hscdata.mtk.nao.ac.jp',
        secure: false,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/data\/s23b_wide\//, '/hsc_ssp/dr4/s23b/validation/hscmap-b4eac0dd1a53a105/data/'),
        auth: secrets.stars
      },
    }
  }
})
