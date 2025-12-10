import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.d.ts',
        '**/main.ts',
        '**/app.module.ts',
        '**/dto/**',
        '**/entities/**',
        '**/types/**',
        '**/constants/**',
        '**/decorators/**',
        '**/guards/**',
        '**/interceptors/**',
        '**/pipes/**',
        '**/validators/**',
        '**/config/**',
        '**/migrations/**',
        '**/seeds/**',
        '**/prisma/**',
        '**/swagger/**',
        '**/health/**',
      ],
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
