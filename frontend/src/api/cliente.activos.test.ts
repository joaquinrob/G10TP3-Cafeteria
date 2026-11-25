import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { pedidoDeMesa } from '../test/fixtures';
import { URL_API, obtenerPedidosActivos } from './cliente';
import { ErrorApi, ErrorContrato, ErrorRed } from './errores';

describe('obtenerPedidosActivos', () => {
  it('pide GET /pedidos/activos?mesaId=N y devuelve los pedidos', async () => {
    let mesaPedida: string | null = null;
    server.use(
      http.get(`${URL_API}/pedidos/activos`, ({ request }) => {
        mesaPedida = new URL(request.url).searchParams.get('mesaId');
        return HttpResponse.json([pedidoDeMesa(1), pedidoDeMesa(2, 'en preparacion')]);
      }),
    );

    const pedidos = await obtenerPedidosActivos(4);

    expect(mesaPedida).toBe('4');
    expect(pedidos.map((p) => [p.id, p.estado])).toEqual([
      [1, 'pendiente'],
      [2, 'en preparacion'],
    ]);
  });

  it('devuelve una lista vacia si la mesa no tiene pedidos en curso', async () => {
    server.use(http.get(`${URL_API}/pedidos/activos`, () => HttpResponse.json([])));

    await expect(obtenerPedidosActivos(4)).resolves.toEqual([]);
  });

  it('conserva el mensaje de la API ante un 400', async () => {
    server.use(
      http.get(`${URL_API}/pedidos/activos`, () =>
        HttpResponse.json({ error: 'mesaId es obligatorio' }, { status: 400 }),
      ),
    );

    const intento = obtenerPedidosActivos(4);

    await expect(intento).rejects.toBeInstanceOf(ErrorApi);
    await expect(intento).rejects.toMatchObject({ status: 400, message: 'mesaId es obligatorio' });
  });

  it('rechaza con ErrorRed si la API esta caida', async () => {
    server.use(http.get(`${URL_API}/pedidos/activos`, () => HttpResponse.error()));

    await expect(obtenerPedidosActivos(4)).rejects.toBeInstanceOf(ErrorRed);
  });

  it('rechaza con ErrorContrato si la respuesta no es una lista de pedidos', async () => {
    server.use(http.get(`${URL_API}/pedidos/activos`, () => HttpResponse.json({ id: 1 })));

    await expect(obtenerPedidosActivos(4)).rejects.toBeInstanceOf(ErrorContrato);
  });
});