import path, { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
// import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  esbuild: {
    ...(process.env.NODE_ENV !== 'development'
      ? {
          drop: [
            // コンソールログを消したい場合はコメントアウトを外す
            // 'console',
            'debugger',
          ],
        }
      : {}),
  },
  resolve: {
    alias: {
      '@pxa-re-management/shared': resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: '@use "@/assets/styles/mixins.sass" as *\n'
      }
    }
  }
});
