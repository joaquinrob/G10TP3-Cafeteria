import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarritoProvider } from '../carrito/CarritoContext';
import type { EstadoCarrito } from '../carrito/tipos';
import { Carrito } from './Carrito';

const conProductos: EstadoCarrito = {
  items: [
    { productoId: 5, nombre: 'Expreso Mediano Colombia', precio: 7360, cantidad: 2 },
    { productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 1 },
  ],
};

function mostrarCarrito() {
  render(
    <CarritoProvider estadoInicial={conProductos}>
      <Carrito onConfirmar={() => {}} />
    </CarritoProvider>,
  );
  return userEvent.setup();
}

describe('Carrito: sumar, restar y quitar', () => {
  it('sumar aumenta la cantidad y actualiza los subtotales', async () => {
    const usuario = mostrarCarrito();

    await usuario.click(screen.getByRole('button', { name: 'Sumar Expreso Mediano Colombia' }));

    expect(screen.getByText('Cantidad: 3')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: $22.080')).toBeInTheDocument();
    expect(screen.getByText('Subtotal general: $24.580')).toBeInTheDocument();
  });

  it('restar baja la cantidad', async () => {
    const usuario = mostrarCarrito();

    await usuario.click(screen.getByRole('button', { name: 'Restar Expreso Mediano Colombia' }));

    expect(screen.getByText('Subtotal: $7.360')).toBeInTheDocument();
    expect(screen.getByText('Subtotal general: $9.860')).toBeInTheDocument();
  });

  it('restar un producto con cantidad 1 lo saca del carrito', async () => {
    const usuario = mostrarCarrito();

    await usuario.click(screen.getByRole('button', { name: 'Restar Muffin de chocolate' }));

    expect(screen.queryByText('Muffin de chocolate')).not.toBeInTheDocument();
    expect(screen.getByText('Subtotal general: $14.720')).toBeInTheDocument();
  });

  it('quitar elimina el producto sin importar la cantidad', async () => {
    const usuario = mostrarCarrito();

    await usuario.click(screen.getByRole('button', { name: 'Quitar Expreso Mediano Colombia' }));

    expect(screen.queryByText('Expreso Mediano Colombia')).not.toBeInTheDocument();
    expect(screen.getByText('Subtotal general: $2.500')).toBeInTheDocument();
  });

  it('al quitar todo el carrito queda vacio y no se puede confirmar', async () => {
    const usuario = mostrarCarrito();

    await usuario.click(screen.getByRole('button', { name: 'Quitar Expreso Mediano Colombia' }));
    await usuario.click(screen.getByRole('button', { name: 'Quitar Muffin de chocolate' }));

    expect(screen.getByText('Tu carrito esta vacio')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled();
  });
});
