import { describe, it, expect } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { expresoMedianoColombia, muffin } from '../test/fixtures';
import { URL_API } from '../api/cliente';
import { useMenu } from './useMenu';

const urlProductos = `${URL_API}/productos`;

describe('useMenu', () => {
  it('empieza en estado cargando', () => {
    server.use(http.get(urlProductos, () => HttpResponse.json([muffin])));

    const { result } = renderHook(() => useMenu());

    expect(result.current.menu).toEqual({ estado: 'cargando' });
  });

  it('pasa a listo con los productos de la API', async () => {
    server.use(http.get(urlProductos, () => HttpResponse.json([expresoMedianoColombia, muffin])));

    const { result } = renderHook(() => useMenu());

    await waitFor(() =>
      expect(result.current.menu).toEqual({
        estado: 'listo',
        productos: [expresoMedianoColombia, muffin],
      }),
    );
  });

  it('pasa a error con el mensaje de la API ante un 500', async () => {
    server.use(
      http.get(urlProductos, () => HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 })),
    );

    const { result } = renderHook(() => useMenu());

    await waitFor(() =>
      expect(result.current.menu).toEqual({ estado: 'error', mensaje: 'Error interno del servidor' }),
    );
  });

  it('pasa a error si la API esta caida', async () => {
    server.use(http.get(urlProductos, () => HttpResponse.error()));

    const { result } = renderHook(() => useMenu());

    await waitFor(() =>
      expect(result.current.menu).toEqual({
        estado: 'error',
        mensaje: 'No se pudo conectar con la cafeteria. Revisa tu conexion e intenta de nuevo.',
      }),
    );
  });

  it('pasa a error si la respuesta no cumple el contrato', async () => {
    server.use(http.get(urlProductos, () => HttpResponse.json([{ ...muffin, precio: '2500' }])));

    const { result } = renderHook(() => useMenu());

    await waitFor(() =>
      expect(result.current.menu).toEqual({
        estado: 'error',
        mensaje: 'La respuesta del servidor no tiene el formato esperado.',
      }),
    );
  });

  it('reintentar vuelve a pedir el menu', async () => {
    let fallar = true;
    server.use(
      http.get(urlProductos, () =>
        fallar
          ? HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
          : HttpResponse.json([muffin]),
      ),
    );
    const { result } = renderHook(() => useMenu());
    await waitFor(() => expect(result.current.menu.estado).toBe('error'));

    fallar = false;
    act(() => result.current.reintentar());

    expect(result.current.menu).toEqual({ estado: 'cargando' });
    await waitFor(() => expect(result.current.menu).toEqual({ estado: 'listo', productos: [muffin] }));
  });
});
