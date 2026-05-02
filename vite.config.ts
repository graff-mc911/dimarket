import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ставимо відносну base-адресу,
// щоб іконки, assets і built-файли працювали не лише з кореня домену.
export default defineConfig({
  base: './',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
