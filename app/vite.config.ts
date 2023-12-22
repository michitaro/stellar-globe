import react from "@vitejs/plugin-react"
import { visualizer } from 'rollup-plugin-visualizer'
import dts from 'vite-plugin-dts'
import { defineConfig } from "vitest/config"
import secrets from './secrets.json'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      outDir: `${__dirname}/'types`,
      entryRoot: './src',
    }),
    visualizer({ gzipSize: true }),
  ],
  build: {
    lib: {
      entry: `${__dirname}/src/index.ts`,
      formats: ['es'],
      fileName: (format) => `react-stellar-globe.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@stellar-globe/stellar-globe', '@stellar-globe/react-stellar-globe'],
      // output: {
      //   globals: {
      //     react: 'React',
      //     'react-dom': 'ReactDOM',
      //   },
      // },
    },
  },
  // build: {
  //   outDir: "build",
  //   sourcemap: true,
  // },
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
        // target: 'https://tomoe.mtk.ioa.s.u-tokyo.ac.jp/skyatlas/hipslist.json',
        target: 'https://tomoe.mtk.ioa.s.u-tokyo.ac.jp',
        // changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tomoegozen\//, '/skyatlas/'),
        secure: false,
      },
    },
  }
})
