import { afterEach, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarritoProvider, useCarrito } from './CarritoContext';
import type { EstadoCarrito } from './tipos';

const CLAVE = 'origen.carrito.mesa-4';

const muffin = { id: 19, nombre: 'Muffin de chocolate', precio: 2500 };

function Sonda() {
  const { estado, dispatch } = useCarrito();
  const cantidad = estado.items.reduce((total, item) => total + item.cantidad, 0);
  return (
    <>
      <p>Unidades: {cantidad}</p>
      <button type="button" onClick={() => dispatch({ tipo: 'agregar', producto: muffin })}>
        Agregar muffin
      </button>
    </>
  );
}

afterEach(() => {
  localStorage.clear();
});

describe('CarritoProvider que recuerda el carrito', () => {
  it('arranca con el carrito guardado en el navegador', () => {
    const guardado: EstadoCarrito = {
      items: [{ productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 3 }],
    };
    localStorage.setItem(CLAVE, JSON.stringify(guardado));

    render(
      <CarritoProvider claveAlmacenamiento={CLAVE}>
        <Sonda />
      </CarritoProvider>,
    );

    expect(screen.getByText('Unidades: 3')).toBeInTheDocument();
  });

  it('guarda cada cambio del carrito', async () => {
    const usuario = userEvent.setup();
    render(
      <CarritoProvider claveAlmacenamiento={CLAVE}>
        <Sonda />
      </CarritoProvider>,
    );

    await usuario.click(screen.getByRole('button', { name: 'Agregar muffin' }));

    expect(JSON.parse(localStorage.getItem(CLAVE) ?? 'null')).toEqual({
      items: [{ productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 1 }],
    });
  });

  it('al volver a montarlo recupera lo que se habia agregado', async () => {
    const usuario = userEvent.setup();
    const { unmount } = render(
      <CarritoProvider claveAlmacenamiento={CLAVE}>
        <Sonda />
      </CarritoProvider>,
    );
    await usuario.click(screen.getByRole('button', { name: 'Agregar muffin' }));
    await usuario.click(screen.getByRole('button', { name: 'Agregar muffin' }));
    unmount();

    render(
      <CarritoProvider claveAlmacenamiento={CLAVE}>
        <Sonda />
      </CarritoProvider>,
    );

    expect(screen.getByText('Unidades: 2')).toBeInTheDocument();
  });

  it('sin clave no lee ni guarda nada en el navegador', async () => {
    const usuario = userEvent.setup();
    render(
      <CarritoProvider>
        <Sonda />
      </CarritoProvider>,
    );

    await usuario.click(screen.getByRole('button', { name: 'Agregar muffin' }));

    expect(localStorage.length).toBe(0);
  });
});
