import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { menuDeEjemplo } from '../test/menu';
import { pedidoMesa4 } from '../test/fixtures';
import { URL_API } from '../api/cliente';
import { CarritoProvider } from '../carrito/CarritoContext';
import { PantallaPedido } from './PantallaPedido';

const urlPedidos = `${URL_API}/pedidos`;

async function armarPedidoYConfirmar() {
  render(
    <CarritoProvider>
      <PantallaPedido productos={menuDeEjemplo} mesa={4} />
    </CarritoProvider>,
  );
  const usuario = userEvent.setup();
  await usuario.click(screen.getByRole('radio', { name: 'Expreso' }));
  await usuario.click(screen.getByRole('radio', { name: 'Mediano' }));
  await usuario.click(screen.getByRole('radio', { name: 'Colombia' }));
  await usuario.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
  await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
  return usuario;
}

function verificarCarritoIntacto() {
  expect(screen.getByText('Expreso Mediano Colombia')).toBeInTheDocument();
  expect(screen.getByText('Cantidad: 1')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeEnabled();
}

describe('PantallaPedido: cuando la API rechaza el pedido', () => {
  it('ante un 400 muestra el mensaje de la API y conserva el carrito', async () => {
    server.use(
      http.post(urlPedidos, () =>
        HttpResponse.json({ error: 'mesaId debe ser un entero mayor a 0' }, { status: 400 }),
      ),
    );

    await armarPedidoYConfirmar();

    expect(await screen.findByRole('alert')).toHaveTextContent('mesaId debe ser un entero mayor a 0');
    verificarCarritoIntacto();
  });

  it('ante un 404 muestra el mensaje de la API y conserva el carrito', async () => {
    server.use(
      http.post(urlPedidos, () =>
        HttpResponse.json({ error: 'Producto 5 no encontrado' }, { status: 404 }),
      ),
    );

    await armarPedidoYConfirmar();

    expect(await screen.findByRole('alert')).toHaveTextContent('Producto 5 no encontrado');
    verificarCarritoIntacto();
  });

  it('ante un 500 muestra el error y deja reintentar con el mismo carrito', async () => {
    let fallar = true;
    server.use(
      http.post(urlPedidos, () =>
        fallar
          ? HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
          : HttpResponse.json(pedidoMesa4, { status: 201 }),
      ),
    );
    const usuario = await armarPedidoYConfirmar();
    expect(await screen.findByRole('alert')).toHaveTextContent('Error interno del servidor');

    fallar = false;
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByText('Pedido #1')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('si la API esta caida muestra un mensaje de conexion y conserva el carrito', async () => {
    server.use(http.post(urlPedidos, () => HttpResponse.error()));

    await armarPedidoYConfirmar();

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con la cafeteria');
    verificarCarritoIntacto();
  });

  it('si la respuesta no cumple el contrato muestra un error y conserva el carrito', async () => {
    server.use(http.post(urlPedidos, () => HttpResponse.json({ id: 1 }, { status: 201 })));

    await armarPedidoYConfirmar();

    expect(await screen.findByRole('alert')).toHaveTextContent('no tiene el formato esperado');
    verificarCarritoIntacto();
  });

  it('mientras se envia el pedido el boton dice Enviando y esta deshabilitado', async () => {
    server.use(
      http.post(urlPedidos, async () => {
        await delay(100);
        return HttpResponse.json(pedidoMesa4, { status: 201 });
      }),
    );

    await armarPedidoYConfirmar();

    expect(screen.getByRole('button', { name: 'Enviando pedido...' })).toBeDisabled();
    expect(await screen.findByText('Pedido #1')).toBeInTheDocument();
  });
});
