// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  // Only include VITE_* environment variables
  const env = loadEnv(mode, process.cwd(), '')
  const envWithProcessPrefix = {
    'process.env': Object.entries(env).reduce(
      (prev, [key, val]) => (key.startsWith('VITE_') ? { ...prev, [key]: val } : prev),
      { NODE_ENV: mode }
    )
  }
  
  return {
    plugins: [
      react({
        // Habilita Fast Refresh
        fastRefresh: true,
        // Habilita el modo estricto solo en desarrollo
        jsxRuntime: 'automatic',
        babel: {
          plugins: [
            // Optimizaciones adicionales para producción
            mode === 'production' && 'babel-plugin-transform-react-remove-prop-types'
          ].filter(Boolean)
        }
      }),
      // Visualizador de paquetes (solo en modo análisis)
      mode === 'analyze' && visualizer({
        open: true,
        filename: 'bundle-analyzer-report.html',
        gzipSize: true,
        brotliSize: true,
      })
    ].filter(Boolean),
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      // Mejora la resolución de módulos
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    
    define: envWithProcessPrefix,
    
    // Optimizaciones de compilación
    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            // Separa las dependencias grandes en chunks separados
            react: ['react', 'react-dom', 'react-router-dom'],
            mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
            charts: ['recharts', 'chart.js'],
            icons: ['@heroicons/react', 'lucide-react', '@mui/icons-material']
          },
          // Mejora el hashing para el cache
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]'
        },
        // Mejora el tree-shaking
        treeshake: true
      },
      // Habilita la compresión gzip y brotli
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      // Previsualización de módulos
      modulePreload: {
        polyfill: false
      },
      cssCodeSplit: true,
      // Elimina los console.logs en producción
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      }
    },
    
    // Optimizaciones del servidor de desarrollo
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      // Mejora el rendimiento del HMR
      hmr: {
        overlay: false
      },
      // Configuración del proxy para evitar problemas de CORS
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://149.130.176.157:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
          // Configuración de CORS
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          },
          // Timeout aumentado para peticiones pesadas
          timeout: 30000
        },
        // Proxy adicional para rutas de autenticación
        '^/auth/.*': {
          target: env.VITE_API_URL || 'http://149.130.176.157:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/auth/, ''),
          // Mismas configuraciones de CORS
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          },
          timeout: 30000
        }
      },
      // Mejora el rendimiento del servidor de desarrollo
      fs: {
        // Habilita el caché para archivos de nodo_modules
        cachedChecks: false
      }
    },
    
    // Optimizaciones de precarga
    preview: {
      port: 4173,
      strictPort: true
    },
    
    // Mejora el rendimiento general
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@mui/material',
        '@emotion/react',
        '@emotion/styled'
      ],
      // Habilita el preempaquetado de dependencias comunes
      entries: [
        './src/main.jsx',
        './src/App.jsx'
      ],
      // Fuerza el preempaquetado de estas dependencias
      force: true
    }
  }
})