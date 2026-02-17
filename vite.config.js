import { defineConfig } from 'vite';

export default defineConfig({
  base: '/thiel-funded/',
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
