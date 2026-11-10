import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarritoProvider } from '../carrito/CarritoContext';
import { Carrito } from './Carrito';

const conUnProducto = {
  items: [{ productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 1 }],
};

describe('Carrito: confirmar', () => {
  it('al confirmar avisa una sola vez', async () => {
    const usuario = userEvent.setup();
    const onConfirmar = vi.fn();
    render(
      <CarritoProvider estadoInicial={conUnProducto}>
        <Carrito onConfirmar={onConfirmar} />
      </CarritoProvider>,
    );

    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });

  it('con el carrito vacio no se puede confirmar', async () => {
    const usuario = userEvent.setup();
    const onConfirmar = vi.fn();
    render(
      <CarritoProvider>
        <Carrito onConfirmar={onConfirmar} />
      </CarritoProvider>,
    );

    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(onConfirmar).not.toHaveBeenCalled();
  });

  it('mientras se envia el pedido el boton queda deshabilitado', () => {
    render(
      <CarritoProvider estadoInicial={conUnProducto}>
        <Carrito onConfirmar={() => {}} enviando />
      </CarritoProvider>,
    );

    expect(screen.getByRole('button', { name: 'Enviando pedido...' })).toBeDisabled();
  });
});
