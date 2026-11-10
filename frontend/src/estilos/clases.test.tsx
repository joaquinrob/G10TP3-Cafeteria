import { afterEach, beforeEach, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { menuDeEjemplo } from '../test/menu';
import { URL_API } from '../api/cliente';
import { App } from '../App';

beforeEach(() => {
  server.use(http.get(`${URL_API}/productos`, () => HttpResponse.json(menuDeEjemplo)));
});

afterEach(() => {
  window.history.pushState({}, '', '/');
});

describe('clases de Bootstrap para el celular', () => {
  it('el contenido principal usa un contenedor de Bootstrap', async () => {
    render(<App />);
    await screen.findByRole('radio', { name: 'Expreso' });

    expect(screen.getByRole('main')).toHaveClass('container');
  });

  it('las opciones usan el formato form-check de Bootstrap', async () => {
    render(<App />);

    const radio = await screen.findByRole('radio', { name: 'Expreso' });

    expect(radio).toHaveClass('form-check-input');
  });

  it('los botones principales ocupan todo el ancho', async () => {
    render(<App />);
    await screen.findByRole('radio', { name: 'Expreso' });

    for (const nombre of ['Agregar al carrito', 'Confirmar pedido']) {
      expect(screen.getByRole('button', { name: nombre })).toHaveClass('btn', 'btn-primary', 'w-100');
    }
  });

  it('el error del menu se ve como una alerta de Bootstrap con un boton para reintentar', async () => {
    server.use(http.get(`${URL_API}/productos`, () => HttpResponse.error()));
    render(<App />);

    const alerta = await screen.findByRole('alert');

    expect(alerta).toHaveClass('alert', 'alert-danger');
    expect(screen.getByRole('button', { name: 'Reintentar' })).toHaveClass('btn', 'btn-danger');
  });

  it('el error del pedido se ve como una alerta de Bootstrap', async () => {
    const usuario = userEvent.setup();
    server.use(
      http.post(`${URL_API}/pedidos`, () => HttpResponse.json({ error: 'Producto 19 no encontrado' }, { status: 404 })),
    );
    render(<App />);

    await usuario.click(await screen.findByRole('button', { name: 'Agregar Muffin de chocolate' }));
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByRole('alert')).toHaveClass('alert', 'alert-danger');
  });
});
