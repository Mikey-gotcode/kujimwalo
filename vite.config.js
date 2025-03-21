import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    host: true, // Allow access from external networks
    port: 5173, // Ensure this matches your dev server port
    allowedHosts: [
      "localhost",
      "https://assuming-severe-accidents-locking.trycloudflare.com",//backend api cor cors
      "oman-exhibits-advertiser-cabinets.trycloudflare.com"
    ],
    cors: true, // Enable CORS for external access
  },
  
})
