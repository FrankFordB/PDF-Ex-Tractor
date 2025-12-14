import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 5000, // Aumentar límite a 5000kb (5MB) - elimina todas las advertencias
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase'
            }
            if (id.includes('pdfjs-dist')) {
              return 'vendor-pdf'
            }
            if (id.includes('xlsx')) {
              return 'vendor-xlsx'
            }
            if (id.includes('tesseract')) {
              return 'vendor-tesseract'
            }
            // Resto de dependencias
            return 'vendor-others'
          }
        }
      }
    }
  }
})