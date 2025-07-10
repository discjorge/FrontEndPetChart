import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:3000',
        '/users': 'http://localhost:3000',
        '/vets': 'http://localhost:3000',
        '/appointments': 'http://localhost:3000', 
        '/messages': 'http://localhost:3000',
      },
    },
})