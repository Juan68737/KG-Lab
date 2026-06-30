import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  // Force esbuild to pre-bundle transformers.js + its onnxruntime-web dep.
  // Without this, Vite serves onnxruntime-web's UMD bundle unbundled and its
  // ESM interop breaks ("registerBackend of undefined"). We dynamic-import the
  // lib, so list it explicitly (dynamic imports aren't always pre-scanned).
  optimizeDeps: {
    include: ['@xenova/transformers'],
  },
})
