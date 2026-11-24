import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  assetsInclude: ['**/*.tiff', '**/*.heic'],
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src'],
      exclude: ['src/**/*.spec.*'],
      bundleTypes: true,
    }),
  ],
  worker: {
    format: 'es',
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
