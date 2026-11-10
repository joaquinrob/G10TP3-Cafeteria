import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarritoProvider, useCarrito } from './CarritoContext';

function Sonda() {
  const { estado, dispatch } = useCarrito();
  return (
    <div>
      <p>Productos: {estado.items.length}</p>
      <button
        onClick={() => dispatch({ tipo: 'agregar', producto: { id: 19, nombre: 'Muffin', precio: 2500 } })}
      >
        Agregar muffin
      </button>
    </div>
  );
}

describe('CarritoContext', () => {
  it('empieza con el carrito vacio', () => {
    render(
      <CarritoProvider>
        <Sonda />
      </CarritoProvider>,
    );
    expect(screen.getByText('Productos: 0')).toBeInTheDocument();
  });

  it('permite agregar productos desde un componente', async () => {
    const usuario = userEvent.setup();
    render(
      <CarritoProvider>
        <Sonda />
      </CarritoProvider>,
    );

    await usuario.click(screen.getByRole('button', { name: 'Agregar muffin' }));

    expect(screen.getByText('Productos: 1')).toBeInTheDocument();
  });

  it('useCarrito fuera del provider lanza un error claro', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Sonda />)).toThrow('useCarrito debe usarse dentro de CarritoProvider');
  });
});
