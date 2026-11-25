import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './servidor';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  // El carrito se recuerda en localStorage: cada test arranca sin carrito guardado.
  // Los tests con entorno node (estilos, viewport) no tienen localStorage.
  if (typeof localStorage !== 'undefined') localStorage.clear();
});

afterAll(() => server.close());
