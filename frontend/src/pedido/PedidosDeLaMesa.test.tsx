import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { pedidoDeMesa } from '../test/fixtures';
import { URL_API } from '../api/cliente';
import { PedidosDeLaMesa } from './PedidosDeLaMesa';

const urlActivos = `${URL_API}/pedidos/activos`;

function seccion() {
  return screen.findByRole('region', { name: 'Pedidos de tu mesa' });
}

describe('PedidosDeLaMesa', () => {
  it('lista los pedidos en curso de la mesa con su numero, estado y total', async () => {
    server.use(
      http.get(urlActivos, () =>
        HttpResponse.json([pedidoDeMesa(1), { ...pedidoDeMesa(2, 'en preparacion'), total: 9000 }]),
      ),
    );
    render(<PedidosDeLaMesa mesa={4} />);

    const lista = within(await seccion()).getAllByRole('listitem');

    expect(lista).toHaveLength(2);
    expect(lista[0]).toHaveTextContent('#1');
    expect(lista[0]).toHaveTextContent('pendiente');
    expect(lista[0]).toHaveTextContent('$2.500');
    expect(lista[1]).toHaveTextContent('#2');
    expect(lista[1]).toHaveTextContent('en preparacion');
    expect(lista[1]).toHaveTextContent('$9.000');
  });

  it('consulta los pedidos de la mesa que recibe', async () => {
    let mesaPedida: string | null = null;
    server.use(
      http.get(urlActivos, ({ request }) => {
        mesaPedida = new URL(request.url).searchParams.get('mesaId');
        return HttpResponse.json([pedidoDeMesa(1, 'pendiente', 7)]);
      }),
    );
    render(<PedidosDeLaMesa mesa={7} />);

    await seccion();

    expect(mesaPedida).toBe('7');
  });

  it('si la mesa no tiene pedidos en curso no muestra la seccion', async () => {
    let consultas = 0;
    server.use(
      http.get(urlActivos, () => {
        consultas += 1;
        return HttpResponse.json([]);
      }),
    );
    render(<PedidosDeLaMesa mesa={4} />);

    await expect.poll(() => consultas).toBe(1);

    expect(screen.queryByRole('region', { name: 'Pedidos de tu mesa' })).not.toBeInTheDocument();
  });

  it('actualizar vuelve a consultar y muestra los estados nuevos y los pedidos nuevos', async () => {
    const usuario = userEvent.setup();
    let respuesta = [pedidoDeMesa(1)];
    server.use(http.get(urlActivos, () => HttpResponse.json(respuesta)));
    render(<PedidosDeLaMesa mesa={4} />);
    await seccion();

    respuesta = [pedidoDeMesa(1, 'en preparacion'), pedidoDeMesa(2)];
    await usuario.click(screen.getByRole('button', { name: 'Actualizar pedidos' }));

    const lista = await within(await seccion()).findAllByRole('listitem');
    expect(lista).toHaveLength(2);
    expect(lista[0]).toHaveTextContent('en preparacion');
    expect(lista[1]).toHaveTextContent('#2');
  });

  it('un pedido que se entrego desaparece de la lista al actualizar', async () => {
    const usuario = userEvent.setup();
    let respuesta = [pedidoDeMesa(1), pedidoDeMesa(2)];
    server.use(http.get(urlActivos, () => HttpResponse.json(respuesta)));
    render(<PedidosDeLaMesa mesa={4} />);
    await seccion();

    respuesta = [pedidoDeMesa(2)];
    await usuario.click(screen.getByRole('button', { name: 'Actualizar pedidos' }));

    await within(await seccion()).findByText('#2');
    expect(screen.queryByText('#1')).not.toBeInTheDocument();
  });

  it('si la API esta caida muestra un mensaje de conexion y permite reintentar', async () => {
    const usuario = userEvent.setup();
    let caida = true;
    server.use(
      http.get(urlActivos, () => (caida ? HttpResponse.error() : HttpResponse.json([pedidoDeMesa(1)]))),
    );
    render(<PedidosDeLaMesa mesa={4} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con la cafeteria');

    caida = false;
    await usuario.click(screen.getByRole('button', { name: 'Actualizar pedidos' }));

    expect(await within(await seccion()).findByText('#1')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('si falla al actualizar, avisa y conserva la ultima lista', async () => {
    const usuario = userEvent.setup();
    let fallar = false;
    server.use(
      http.get(urlActivos, () =>
        fallar ? HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 }) : HttpResponse.json([pedidoDeMesa(1)]),
      ),
    );
    render(<PedidosDeLaMesa mesa={4} />);
    await seccion();

    fallar = true;
    await usuario.click(screen.getByRole('button', { name: 'Actualizar pedidos' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Error interno del servidor');
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('mientras actualiza deshabilita el boton', async () => {
    const usuario = userEvent.setup();
    let liberar: () => void = () => {};
    const espera = new Promise<void>((resolver) => {
      liberar = resolver;
    });
    let primera = true;
    server.use(
      http.get(urlActivos, async () => {
        if (!primera) await espera;
        primera = false;
        return HttpResponse.json([pedidoDeMesa(1)]);
      }),
    );
    render(<PedidosDeLaMesa mesa={4} />);
    await seccion();

    await usuario.click(screen.getByRole('button', { name: 'Actualizar pedidos' }));

    expect(screen.getByRole('button', { name: 'Actualizando...' })).toBeDisabled();
    liberar();
    expect(await screen.findByRole('button', { name: 'Actualizar pedidos' })).toBeEnabled();
  });
});