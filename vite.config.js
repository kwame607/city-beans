import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 'serve' = npm run dev (local) → lives at the root, so /admin etc. work as-is
  // 'build' = npm run build (GitHub Pages) → lives under /city-beans/
  base: command === 'build' ? '/city-beans/' : '/',
}))
