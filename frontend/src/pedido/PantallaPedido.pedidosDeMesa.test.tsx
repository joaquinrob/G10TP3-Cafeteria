import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { menuDeEjemplo } from '../test/menu';
import { pedidoDeMesa } from '../test/fixtures';
import { URL_API } from '../api/cliente';
import { CarritoProvider } from '../carrito/CarritoContext';
import { PantallaPedido } from './PantallaPedido';

const urlActivos = `${URL_API}/pedidos/activos`;

function mostrarPantalla(mesa: number | null) {
  render(
    <CarritoProvider>
      <PantallaPedido productos={menuDeEjemplo} mesa={mesa} />
    </CarritoProvider>,
  );
  return userEvent.setup();
}

async function pedirMuffinYConfirmar(usuario: ReturnType<typeof userEvent.setup>) {
  await usuario.click(screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }));
  await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
}

describe('PantallaPedido: pedidos en curso de la mesa', () => {
  it('al abrir la mesa muestra los pedidos que ya estan en curso', async () => {
    server.use(http.get(urlActivos, () => HttpResponse.json([pedidoDeMesa(3, 'en preparacion')])));
    mostrarPantalla(4);

    const lista = await screen.findByRole('region', { name: 'Pedidos de tu mesa' });

    expect(within(lista).getByText('#3')).toBeInTheDocument();
    expect(within(lista).getByText('en preparacion')).toBeInTheDocument();
  });

  it('despues de confirmar un segundo pedido se ven los dos', async () => {
    let respuesta = [pedidoDeMesa(1, 'en preparacion')];
    server.use(
      http.get(urlActivos, () => HttpResponse.json(respuesta)),
      http.post(`${URL_API}/pedidos`, () => {
        respuesta = [...respuesta, pedidoDeMesa(2)];
        return HttpResponse.json(pedidoDeMesa(2), { status: 201 });
      }),
    );
    const usuario = mostrarPantalla(4);
    await screen.findByRole('region', { name: 'Pedidos de tu mesa' });

    await pedirMuffinYConfirmar(usuario);

    expect(await screen.findByText('Pedido #2')).toBeInTheDocument();
    const lista = await screen.findByRole('region', { name: 'Pedidos de tu mesa' });
    await within(lista).findByText('#2');
    expect(within(lista).getByText('#1')).toBeInTheDocument();
    expect(within(lista).getAllByRole('listitem')).toHaveLength(2);
  });

  it('al volver al menu con "Hacer otro pedido" la lista sigue visible', async () => {
    server.use(
      http.get(urlActivos, () => HttpResponse.json([pedidoDeMesa(1)])),
      http.post(`${URL_API}/pedidos`, () => HttpResponse.json(pedidoDeMesa(1), { status: 201 })),
    );
    const usuario = mostrarPantalla(4);
    await pedirMuffinYConfirmar(usuario);
    await screen.findByText('Pedido #1');

    await usuario.click(screen.getByRole('button', { name: 'Hacer otro pedido' }));

    const lista = await screen.findByRole('region', { name: 'Pedidos de tu mesa' });
    expect(within(lista).getByText('#1')).toBeInTheDocument();
  });

  it('si no se pudo consultar la lista, el menu y el pedido siguen funcionando', async () => {
    server.use(
      http.get(urlActivos, () => HttpResponse.error()),
      http.post(`${URL_API}/pedidos`, () => HttpResponse.json(pedidoDeMesa(1), { status: 201 })),
    );
    const usuario = mostrarPantalla(4);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con la cafeteria');
    await pedirMuffinYConfirmar(usuario);

    expect(await screen.findByText('Pedido #1')).toBeInTheDocument();
  });

  it('sin mesa (retiro en la barra) no consulta los pedidos de ninguna mesa', async () => {
    let consultas = 0;
    server.use(
      http.get(urlActivos, () => {
        consultas += 1;
        return HttpResponse.json([pedidoDeMesa(1)]);
      }),
      http.post(`${URL_API}/pedidos`, () =>
        HttpResponse.json({ ...pedidoDeMesa(1), mesaId: undefined }, { status: 201 }),
      ),
    );
    const usuario = mostrarPantalla(null);

    await pedirMuffinYConfirmar(usuario);
    await screen.findByText('Pedido #1');

    expect(consultas).toBe(0);
    expect(screen.queryByRole('region', { name: 'Pedidos de tu mesa' })).not.toBeInTheDocument();
  });
});