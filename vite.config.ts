import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        imprint: resolve(__dirname, 'imprint.html'),
        privacy: resolve(__dirname, 'privacy.html')
      }
    }
  }
});
