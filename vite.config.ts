import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
    tsconfigPaths(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'production'
    ),
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'UbidotsReactHtmlCanvas',
      fileName: format => {
        if (format === 'es') return 'react-html-canvas.es.js';
        if (format === 'cjs') return 'react-html-canvas.cjs.js';
        if (format === 'umd') return 'react-html-canvas.umd.js';
        return `react-html-canvas.${format}.js`;
      },
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@ubidots/ubidots-javascript-library'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@ubidots/ubidots-javascript-library': 'UbidotsJS',
        },
      },
    },
    target: 'es2015',
  },
});
