import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  css: {
    preprocessorOptions: {
      // Bootstrap 5 todavia usa @import: se silencia ese aviso y los de sus propios archivos.
      scss: { quietDeps: true, silenceDeprecations: ['import'] },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    pool: 'threads',
  },
});
