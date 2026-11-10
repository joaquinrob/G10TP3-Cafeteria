import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { menuDeEjemplo } from '../test/menu';
import { pedidoMesa4 } from '../test/fixtures';
import { URL_API } from '../api/cliente';
import { CarritoProvider } from '../carrito/CarritoContext';
import { PantallaPedido } from './PantallaPedido';

type Usuario = ReturnType<typeof userEvent.setup>;

function mostrarPantalla(mesa: number | null) {
  render(
    <CarritoProvider>
      <PantallaPedido productos={menuDeEjemplo} mesa={mesa} />
    </CarritoProvider>,
  );
  return userEvent.setup();
}

async function agregarExpresoMedianoColombia(usuario: Usuario) {
  await usuario.click(screen.getByRole('radio', { name: 'Expreso' }));
  await usuario.click(screen.getByRole('radio', { name: 'Mediano' }));
  await usuario.click(screen.getByRole('radio', { name: 'Colombia' }));
  await usuario.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
}

describe('PantallaPedido: confirmar el pedido', () => {
  it('envia la mesa y los items y muestra el pedido que devolvio la API', async () => {
    let cuerpoEnviado: unknown;
    server.use(
      http.post(`${URL_API}/pedidos`, async ({ request }) => {
        cuerpoEnviado = await request.json();
        return HttpResponse.json(pedidoMesa4, { status: 201 });
      }),
    );
    const usuario = mostrarPantalla(4);

    await agregarExpresoMedianoColombia(usuario);
    await agregarExpresoMedianoColombia(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }));
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByText('Pedido #1')).toBeInTheDocument();
    expect(cuerpoEnviado).toEqual({
      mesaId: 4,
      items: [
        { productoId: 5, cantidad: 2 },
        { productoId: 19, cantidad: 1 },
      ],
    });
    expect(screen.getByText('Estado: pendiente')).toBeInTheDocument();
  });

  it('muestra el total que calculo la API, sin recalcularlo', async () => {
    server.use(
      http.post(`${URL_API}/pedidos`, () =>
        HttpResponse.json({ ...pedidoMesa4, total: 9999 }, { status: 201 }),
      ),
    );
    const usuario = mostrarPantalla(4);

    await agregarExpresoMedianoColombia(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByText('Total: $9.999')).toBeInTheDocument();
  });

  it('sin mesa no envia mesaId (retiro en la barra)', async () => {
    let cuerpoEnviado: object = {};
    server.use(
      http.post(`${URL_API}/pedidos`, async ({ request }) => {
        cuerpoEnviado = (await request.json()) as object;
        return HttpResponse.json({ ...pedidoMesa4, mesaId: undefined }, { status: 201 });
      }),
    );
    const usuario = mostrarPantalla(null);

    await usuario.click(screen.getByRole('button', { name: 'Agregar Torta selva negra' }));
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    await screen.findByText('Pedido #1');
    expect(cuerpoEnviado).not.toHaveProperty('mesaId');
    expect(cuerpoEnviado).toEqual({ items: [{ productoId: 20, cantidad: 1 }] });
  });

  it('despues de confirmar se puede hacer otro pedido con el carrito vacio', async () => {
    server.use(http.post(`${URL_API}/pedidos`, () => HttpResponse.json(pedidoMesa4, { status: 201 })));
    const usuario = mostrarPantalla(4);
    await usuario.click(screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }));
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    await screen.findByText('Pedido #1');

    await usuario.click(screen.getByRole('button', { name: 'Hacer otro pedido' }));

    expect(screen.getByText('Tu carrito esta vacio')).toBeInTheDocument();
    expect(screen.queryByText('Pedido #1')).not.toBeInTheDocument();
  });
});
