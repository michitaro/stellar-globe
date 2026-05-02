import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'
import { createTsconfigAlias } from './vite.alias'


export default defineConfig({
  plugins: [
    dts({
      outDir: resolve(__dirname, 'types'),
      entryRoot: './src',
    }),
    // @ts-ignore
    visualizer({ gzipSize: true }),
  ],
  resolve: {
    alias: createTsconfigAlias(),
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
  },
  test: {
    setupFiles: [
      './test/matchers.ts',
    ],
  },
})
