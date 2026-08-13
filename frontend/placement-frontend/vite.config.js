import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ── Development Server ────────────────────────────────────────────
  server: {
    port: 5173,
    strictPort: true,

    // Proxy API calls to the Spring Boot backend during development.
    // This avoids CORS issues in the browser during local development.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ── Build ─────────────────────────────────────────────────────────
  build: {
    outDir: 'dist',
    sourcemap: false,
  },

  // ── Path Aliases ──────────────────────────────────────────────────
  // Allows clean imports: import { something } from '@/components/...'
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
