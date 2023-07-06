import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import postCSSNesting from 'postcss-nesting'

export default defineConfig({
  plugins: [tsconfigPaths()],
  server: { open: true, host: true, port: 5_174 },
  preview: { open: true, host: true, port: 5_175 },
  css: { postcss: { plugins: [postCSSNesting()] } },
})
