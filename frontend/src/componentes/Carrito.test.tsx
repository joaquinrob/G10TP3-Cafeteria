import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CarritoProvider } from '../carrito/CarritoContext';
import type { EstadoCarrito } from '../carrito/tipos';
import { Carrito } from './Carrito';

const conProductos: EstadoCarrito = {
  items: [
    { productoId: 5, nombre: 'Expreso Mediano Colombia', precio: 7360, cantidad: 2 },
    { productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 1 },
  ],
};

function mostrarCarrito(estado?: EstadoCarrito) {
  render(
    <CarritoProvider estadoInicial={estado}>
      <Carrito onConfirmar={() => {}} />
    </CarritoProvider>,
  );
}

describe('Carrito: contenido', () => {
  it('vacio avisa que no hay productos y no deja confirmar', () => {
    mostrarCarrito();

    expect(screen.getByText('Tu carrito esta vacio')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled();
  });

  it('muestra cada producto con su cantidad y subtotal', () => {
    mostrarCarrito(conProductos);

    expect(screen.getByText('Expreso Mediano Colombia')).toBeInTheDocument();
    expect(screen.getByText('Cantidad: 2')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: $14.720')).toBeInTheDocument();
    expect(screen.getByText('Muffin de chocolate')).toBeInTheDocument();
    expect(screen.getByText('Cantidad: 1')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: $2.500')).toBeInTheDocument();
  });

  it('muestra el subtotal general y deja confirmar', () => {
    mostrarCarrito(conProductos);

    expect(screen.getByText('Subtotal general: $17.220')).toBeInTheDocument();
    expect(screen.queryByText('Tu carrito esta vacio')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeEnabled();
  });
});
