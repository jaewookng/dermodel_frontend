import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      three: 'three'
    }
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
})
