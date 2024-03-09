import react from "@vitejs/plugin-react"
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from "vitest/config"
import secrets from './secrets.json'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ gzipSize: true }),
  ],
  build: {
    lib: {
      entry: {
        app: `${__dirname}/src/index.ts`,
        commTools: `${__dirname}/src/commTools/index.ts`,
      },
      formats: ['es'],
      fileName: (format, name) => {
        return `${name}.${format}.js`
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@stellar-globe/stellar-globe', '@stellar-globe/react-stellar-globe'],
    },
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
      '/tomoegozen/': {
        target: 'https://tomoe.mtk.ioa.s.u-tokyo.ac.jp',
        rewrite: (path) => path.replace(/^\/tomoegozen\//, '/skyatlas/'),
        secure: false,
      },
    },
  }
})
