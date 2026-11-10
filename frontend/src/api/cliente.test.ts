import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { expresoMedianoColombia, muffin } from '../test/fixtures';
import { URL_API, obtenerProductos } from './cliente';
import { ErrorApi, ErrorContrato, ErrorRed } from './errores';

describe('obtenerProductos', () => {
  it('devuelve los productos de GET /productos', async () => {
    server.use(http.get(`${URL_API}/productos`, () => HttpResponse.json([expresoMedianoColombia, muffin])));

    const productos = await obtenerProductos();

    expect(productos).toEqual([expresoMedianoColombia, muffin]);
  });

  it('rechaza con ErrorRed si la API esta caida', async () => {
    server.use(http.get(`${URL_API}/productos`, () => HttpResponse.error()));

    await expect(obtenerProductos()).rejects.toBeInstanceOf(ErrorRed);
  });

  it('rechaza con ErrorApi y el mensaje de la API ante un 500', async () => {
    server.use(
      http.get(`${URL_API}/productos`, () =>
        HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 }),
      ),
    );

    const intento = obtenerProductos();

    await expect(intento).rejects.toBeInstanceOf(ErrorApi);
    await expect(intento).rejects.toMatchObject({ status: 500, message: 'Error interno del servidor' });
  });

  it('usa un mensaje generico si el error no trae el formato { error }', async () => {
    server.use(http.get(`${URL_API}/productos`, () => new HttpResponse('boom', { status: 500 })));

    await expect(obtenerProductos()).rejects.toMatchObject({
      status: 500,
      message: 'Error 500 del servidor',
    });
  });

  it('rechaza con ErrorContrato si la respuesta no cumple el contrato', async () => {
    const roto = { ...muffin, precio: '2500' };
    server.use(http.get(`${URL_API}/productos`, () => HttpResponse.json([roto])));

    await expect(obtenerProductos()).rejects.toBeInstanceOf(ErrorContrato);
  });
});
