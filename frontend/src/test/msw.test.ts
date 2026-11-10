import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './servidor';

describe('MSW', () => {
  it('intercepta las llamadas a la API en los tests', async () => {
    server.use(http.get('http://localhost:3000/productos', () => HttpResponse.json([{ id: 1 }])));

    const respuesta = await fetch('http://localhost:3000/productos');

    expect(respuesta.status).toBe(200);
    expect(await respuesta.json()).toEqual([{ id: 1 }]);
  });
});
