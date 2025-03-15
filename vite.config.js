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
      "previews-options-down-explain.trycloudflare.com", // Cloudflare Tunnel URL
      ".trycloudflare.com", // Allow any Cloudflare subdomain
      "localhost",
      "https://whatever-premiere-funk-adopt.trycloudflare.com"//backend api cor cors
    ],
    cors: true, // Enable CORS for external access
  },
  
})
