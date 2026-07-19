import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Custom domain serves from the root, not /SangeethWedsArya/
  base: '/',
  build: {
    // One HTML entry per invite variant. Link-preview scrapers don't run
    // JavaScript, so the only way a shared /reception/ link can show
    // reception details in its preview is a real file with its own tags.
    // All three load the same app bundle.
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        wedding: resolve(__dirname, 'wedding/index.html'),
        reception: resolve(__dirname, 'reception/index.html'),
      },
    },
  },
})
