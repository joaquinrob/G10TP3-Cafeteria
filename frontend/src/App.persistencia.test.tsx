import { afterEach, beforeEach, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from './test/servidor';
import { menuDeEjemplo } from './test/menu';
import { pedidoMesa4 } from './test/fixtures';
import { URL_API } from './api/cliente';
import { App } from './App';

function abrirConQuery(query: string) {
  window.history.pushState({}, '', `/${query}`);
}

/** Simula que el cliente recarga la pagina: se desmonta todo y se vuelve a montar la App. */
async function recargar(unmount: () => void) {
  unmount();
  render(<App />);
  await screen.findByRole('radio', { name: 'Expreso' });
}

beforeEach(() => {
  server.use(http.get(`${URL_API}/productos`, () => HttpResponse.json(menuDeEjemplo)));
});

afterEach(() => {
  window.history.pushState({}, '', '/');
});

describe('App recuerda el carrito', () => {
  it('al recargar la pagina el carrito sigue ahi', async () => {
    const usuario = userEvent.setup();
    abrirConQuery('?mesa=4');
    const { unmount } = render(<App />);
    await usuario.click(await screen.findByRole('button', { name: 'Agregar Muffin de chocolate' }));
    await usuario.click(screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }));

    await recargar(unmount);

    expect(screen.getByText('Cantidad: 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeEnabled();
  });

  it('cada mesa tiene su propio carrito', async () => {
    const usuario = userEvent.setup();
    abrirConQuery('?mesa=4');
    const { unmount } = render(<App />);
    await usuario.click(await screen.findByRole('button', { name: 'Agregar Muffin de chocolate' }));

    abrirConQuery('?mesa=7');
    await recargar(unmount);

    expect(screen.getByText('Tu carrito esta vacio')).toBeInTheDocument();
  });

  it('despues de confirmar el pedido, al recargar el carrito esta vacio', async () => {
    const usuario = userEvent.setup();
    server.use(http.post(`${URL_API}/pedidos`, () => HttpResponse.json(pedidoMesa4, { status: 201 })));
    abrirConQuery('?mesa=4');
    const { unmount } = render(<App />);
    await usuario.click(await screen.findByRole('button', { name: 'Agregar Muffin de chocolate' }));
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    await screen.findByText('Pedido #1');

    await recargar(unmount);

    expect(screen.getByText('Tu carrito esta vacio')).toBeInTheDocument();
  });

  it('si el pedido falla, al recargar el carrito no se pierde', async () => {
    const usuario = userEvent.setup();
    server.use(
      http.post(`${URL_API}/pedidos`, () =>
        HttpResponse.json({ error: 'La mesa 4 no existe' }, { status: 400 }),
      ),
    );
    abrirConQuery('?mesa=4');
    const { unmount } = render(<App />);
    await usuario.click(await screen.findByRole('button', { name: 'Agregar Muffin de chocolate' }));
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    await screen.findByRole('alert');

    await recargar(unmount);

    expect(screen.getByText('Cantidad: 1')).toBeInTheDocument();
  });
});
