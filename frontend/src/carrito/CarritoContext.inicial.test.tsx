import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CarritoProvider, useCarrito } from './CarritoContext';
import type { EstadoCarrito } from './tipos';

function Sonda() {
  const { estado } = useCarrito();
  return <p>Productos: {estado.items.length}</p>;
}

describe('CarritoProvider con estado inicial', () => {
  it('arranca con el estado que se le pasa', () => {
    const inicial: EstadoCarrito = {
      items: [{ productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 2 }],
    };

    render(
      <CarritoProvider estadoInicial={inicial}>
        <Sonda />
      </CarritoProvider>,
    );

    expect(screen.getByText('Productos: 1')).toBeInTheDocument();
  });
});
