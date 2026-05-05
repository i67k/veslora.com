import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        imprint: 'imprint.html',
        privacy: 'privacy.html'
      }
    }
  }
});
