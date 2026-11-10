import { setupServer } from 'msw/node';

/** Servidor MSW compartido por todos los tests: cada test agrega sus handlers con server.use(). */
export const server = setupServer();
