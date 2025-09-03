import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // MUY IMPORTANTE: el nombre EXACTO del repo, con slashes
  base: '/isfd-braslavsky/',
})
