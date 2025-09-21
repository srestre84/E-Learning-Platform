import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react']
        }
      }
    }
  },
  define: {
    'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'https://e-learning-platform-backend.railway.app/api')
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://e-learning-platform-backend.railway.app',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
