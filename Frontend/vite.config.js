import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {
  // Cargar variables de entorno
  const env = loadEnv( __dirname, '')

  // Log para debug

  return {
    plugins: [react()],
    css: {
      postcss: './postcss.config.js'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },

    // Configuración del servidor de desarrollo
    server: {
      port: 5173,
      open: true,
      host: true,
      // Configuración de proxy para APIs (descomenta si necesitas)
       proxy: {
         '/api': {
           target: env.VITE_API_URL,
           changeOrigin: true,
           secure: false
         }
       }
    },
  }
})