import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { pedidoMesa4 } from '../test/fixtures';
import { URL_API, crearPedido } from './cliente';
import { ErrorApi, ErrorContrato } from './errores';

const items = [
  { productoId: 5, cantidad: 2 },
  { productoId: 19, cantidad: 1 },
];

describe('crearPedido', () => {
  it('envia POST /pedidos con mesaId e items y devuelve el pedido', async () => {
    let cuerpoEnviado: unknown;
    let tipoContenido: string | null = null;
    server.use(
      http.post(`${URL_API}/pedidos`, async ({ request }) => {
        cuerpoEnviado = await request.json();
        tipoContenido = request.headers.get('content-type');
        return HttpResponse.json(pedidoMesa4, { status: 201 });
      }),
    );

    const pedido = await crearPedido({ mesaId: 4, items });

    expect(cuerpoEnviado).toEqual({ mesaId: 4, items });
    expect(tipoContenido).toBe('application/json');
    expect(pedido).toEqual(pedidoMesa4);
  });

  it('sin mesa no envia mesaId (retiro en la barra)', async () => {
    let cuerpoEnviado: object = {};
    server.use(
      http.post(`${URL_API}/pedidos`, async ({ request }) => {
        cuerpoEnviado = (await request.json()) as object;
        return HttpResponse.json(pedidoMesa4, { status: 201 });
      }),
    );

    await crearPedido({ mesaId: null, items });

    expect(cuerpoEnviado).not.toHaveProperty('mesaId');
    expect(cuerpoEnviado).toEqual({ items });
  });

  it('conserva el mensaje que devuelve la API ante un 400', async () => {
    server.use(
      http.post(`${URL_API}/pedidos`, () =>
        HttpResponse.json({ error: 'mesaId debe ser un entero mayor a 0' }, { status: 400 }),
      ),
    );

    const intento = crearPedido({ mesaId: 4, items });

    await expect(intento).rejects.toBeInstanceOf(ErrorApi);
    await expect(intento).rejects.toMatchObject({
      status: 400,
      message: 'mesaId debe ser un entero mayor a 0',
    });
  });

  it('conserva el mensaje ante un 404 (producto inexistente)', async () => {
    server.use(
      http.post(`${URL_API}/pedidos`, () =>
        HttpResponse.json({ error: 'Producto 999 no encontrado' }, { status: 404 }),
      ),
    );

    await expect(crearPedido({ mesaId: null, items })).rejects.toMatchObject({
      status: 404,
      message: 'Producto 999 no encontrado',
    });
  });

  it('rechaza con ErrorContrato si el pedido devuelto no cumple el contrato', async () => {
    server.use(http.post(`${URL_API}/pedidos`, () => HttpResponse.json({ id: 1 }, { status: 201 })));

    await expect(crearPedido({ mesaId: 4, items })).rejects.toBeInstanceOf(ErrorContrato);
  });
});
