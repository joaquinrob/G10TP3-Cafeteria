import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { URL_API } from '../api/cliente';

/** Servidor MSW compartido por todos los tests: cada test agrega sus handlers con server.use(). */
export const server = setupServer(
  http.get(`${URL_API}/pedidos/activos`, () => HttpResponse.json([])),
);