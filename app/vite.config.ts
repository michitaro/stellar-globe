import { defineConfig } from "vitest/config"
import secrets from './secrets.json'

export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
  server: {
    proxy: {
      '/hsc_ssp/': {
        target: 'https://hscdata.mtk.nao.ac.jp',
        secure: false,
        changeOrigin: true,
        auth: secrets.stars,
      },
      '/data/s23b_wide/': {
        target: 'https://hscdata.mtk.nao.ac.jp',
        secure: false,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/data\/s23b_wide\//, '/hsc_ssp/dr4/s23b/validation/hscmap-b4eac0dd1a53a105/data/'),
        auth: secrets.stars
      },
      '/tomoegozen/': {
        target: 'https://tomoe.mtk.ioa.s.u-tokyo.ac.jp',
        rewrite: (path) => path.replace(/^\/tomoegozen\//, '/skyatlas/'),
        secure: false,
      },
    },
  }
})
