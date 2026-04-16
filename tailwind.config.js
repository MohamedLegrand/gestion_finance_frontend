/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Scanne tous les fichiers JS et JSX dans src
  ],
  theme: {
    extend: {
      colors: {
        // Optionnel : Couleurs personnalisées pour ton app de finance
        finance: {
          green: '#10b981',
          red: '#ef4444',
          dark: '#1f2937',
        }
      }
    },
  },
  plugins: [],
}