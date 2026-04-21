import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Cela définit "process.env" comme un objet vide pour éviter 
    // l'erreur "process is not defined" dans le navigateur.
    'process.env': {}
  }
})