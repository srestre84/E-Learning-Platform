// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  // Only include VITE_* environment variables
  const env = loadEnv(mode, process.cwd(), '')
  const envWithProcessPrefix = {
    'process.env': Object.entries(env).reduce(
      (prev, [key, val]) => {
        if (key.startsWith('VITE_')) {
          return {
            ...prev,
            [key]: val
          }
        }
        return prev
      },
      {}
    )
  }
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: envWithProcessPrefix,
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://149.130.176.157:8080/',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})