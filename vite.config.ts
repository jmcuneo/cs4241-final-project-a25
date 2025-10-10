import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    server: {
      // set up a proxy to the express server
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
})
