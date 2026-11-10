import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { pedidoMesa4 } from '../test/fixtures';
import { URL_API, obtenerPedido } from './cliente';
import { ErrorApi, ErrorRed } from './errores';

describe('obtenerPedido', () => {
  it('pide GET /pedidos/:id y devuelve el pedido con su estado', async () => {
    server.use(
      http.get(`${URL_API}/pedidos/1`, () =>
        HttpResponse.json({ ...pedidoMesa4, estado: 'en preparacion' }),
      ),
    );

    const pedido = await obtenerPedido(1);

    expect(pedido.id).toBe(1);
    expect(pedido.estado).toBe('en preparacion');
    expect(pedido.total).toBe(17220);
  });

  it('conserva el mensaje de la API ante un 404', async () => {
    server.use(
      http.get(`${URL_API}/pedidos/42`, () =>
        HttpResponse.json({ error: 'Pedido 42 no encontrado' }, { status: 404 }),
      ),
    );

    const intento = obtenerPedido(42);

    await expect(intento).rejects.toBeInstanceOf(ErrorApi);
    await expect(intento).rejects.toMatchObject({ status: 404, message: 'Pedido 42 no encontrado' });
  });

  it('rechaza con ErrorRed si la API esta caida', async () => {
    server.use(http.get(`${URL_API}/pedidos/1`, () => HttpResponse.error()));

    await expect(obtenerPedido(1)).rejects.toBeInstanceOf(ErrorRed);
  });
});
