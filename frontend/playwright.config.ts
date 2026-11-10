import { defineConfig, devices } from '@playwright/test';
import { URL_API_E2E, URL_FRONT_E2E } from './e2e/entorno';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  // Los tests comparten la API (que guarda los pedidos en memoria): se corren de a uno.
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: URL_FRONT_E2E,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      // La API real, en modo test: habilita POST /__test__/reset y /__test__/seed
      command: 'npm run dev',
      cwd: '..',
      url: `${URL_API_E2E}/productos`,
      env: { NODE_ENV: 'test', PORT: '3100' },
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      // El front real, apuntando a esa API
      command: 'npm run dev -- --port 5273 --strictPort',
      url: URL_FRONT_E2E,
      env: { VITE_API_URL: URL_API_E2E },
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
