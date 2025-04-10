import { UserConfig } from 'vite'

const VERSION = "1.0.0"

export default {
  build: {
    lib: {
      entry: ['src/GlassAPI.ts'],
      name: 'mod',
      formats: ['iife'],
    },
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        entryFileNames: 'GlassAPI-'+VERSION+".js",
      }
    }
  }
} satisfies UserConfig