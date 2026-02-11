import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
    tsconfigPaths(),
  ],
  root: 'examples/dev',
  publicDir: '../../public',
  resolve: {
    alias: {
      '@ubidots/react-html-canvas': path.resolve(__dirname, './src/index.ts'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
