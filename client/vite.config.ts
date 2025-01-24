import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// 本番環境用ベースパス追加
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: '../dist'
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  }
});
