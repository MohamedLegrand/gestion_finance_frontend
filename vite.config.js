import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  define: {
    'process.env': {}
  },
  
  base: './',
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  server: {
    port: 3000,
    open: true,
    // Optimisations pour le rechargement rapide
    hmr: {
      overlay: true,
      protocol: 'ws',
      host: 'localhost',
      port: 3000
    },
    watch: {
      // Utilise l'option poll si les changements ne sont pas détectés
      // usePolling: true,
      // interval: 1000
    },
    // Évite les problèmes de CORS en dev
    cors: true,
    // Réduit le temps de rechargement
    warmup: {
      clientFiles: ['./src/pages/comptes/Comptes.jsx', './src/pages/transactions/Transactions.jsx']
    }
  },
  
  // Optimise les dépendances pour un démarrage plus rapide
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios'
    ],
    // Force l'optimisation au démarrage
    force: true
  },
  
  // Résolution des modules
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@utils': '/src/utils'
    }
  },
  
  // Cache
  cacheDir: '.vite-cache'
})