import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Thư mục build đầu ra theo yêu cầu release chính thức: 'release website 2409'
    outDir: 'release website 2409',
    // Vô hiệu hóa source maps trên production để tránh lộ cấu trúc và mã nguồn gốc
    sourcemap: false,
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
