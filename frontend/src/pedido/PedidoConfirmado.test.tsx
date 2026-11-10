import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { pedidoMesa4 } from '../test/fixtures';
import { pedidoSchema } from '../api/contrato';
import { URL_API } from '../api/cliente';
import { PedidoConfirmado } from './PedidoConfirmado';

const pedido = pedidoSchema.parse(pedidoMesa4);

describe('PedidoConfirmado', () => {
  it('muestra el numero, el estado y el total que devolvio la API', () => {
    render(<PedidoConfirmado pedido={pedido} onNuevoPedido={() => {}} />);

    expect(screen.getByText('Pedido #1')).toBeInTheDocument();
    expect(screen.getByText('Estado: pendiente')).toBeInTheDocument();
    expect(screen.getByText('Total: $17.220')).toBeInTheDocument();
  });

  it('actualizar el estado consulta GET /pedidos/:id sin recargar la pagina', async () => {
    const usuario = userEvent.setup();
    server.use(
      http.get(`${URL_API}/pedidos/1`, () => HttpResponse.json({ ...pedidoMesa4, estado: 'en preparacion' })),
    );
    render(<PedidoConfirmado pedido={pedido} onNuevoPedido={() => {}} />);

    await usuario.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(await screen.findByText('Estado: en preparacion')).toBeInTheDocument();
    expect(screen.queryByText('Estado: pendiente')).not.toBeInTheDocument();
  });

  it('si la consulta falla muestra el mensaje y conserva el ultimo estado', async () => {
    const usuario = userEvent.setup();
    server.use(
      http.get(`${URL_API}/pedidos/1`, () =>
        HttpResponse.json({ error: 'Pedido 1 no encontrado' }, { status: 404 }),
      ),
    );
    render(<PedidoConfirmado pedido={pedido} onNuevoPedido={() => {}} />);

    await usuario.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Pedido 1 no encontrado');
    expect(screen.getByText('Estado: pendiente')).toBeInTheDocument();
  });

  it('si la API esta caida muestra un mensaje de conexion', async () => {
    const usuario = userEvent.setup();
    server.use(http.get(`${URL_API}/pedidos/1`, () => HttpResponse.error()));
    render(<PedidoConfirmado pedido={pedido} onNuevoPedido={() => {}} />);

    await usuario.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con la cafeteria');
  });

  it('permite hacer otro pedido', async () => {
    const usuario = userEvent.setup();
    const onNuevoPedido = vi.fn();
    render(<PedidoConfirmado pedido={pedido} onNuevoPedido={onNuevoPedido} />);

    await usuario.click(screen.getByRole('button', { name: 'Hacer otro pedido' }));

    expect(onNuevoPedido).toHaveBeenCalledTimes(1);
  });
});
