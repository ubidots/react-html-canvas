import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      exclude: [
        'examples/**',
        'src/types/**',
        'src/**/index.ts',
        '**/*.d.ts',
        '**/__tests__/**',
        '**/node_modules/**',
        'dist/**',
        'vite.config.ts',
        'vitest.config.ts',
        'vitest.setup.ts',
        'eslint.config.js',
      ],
      include: ['src/**/*.{ts,tsx}'],
      all: true,
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
});
