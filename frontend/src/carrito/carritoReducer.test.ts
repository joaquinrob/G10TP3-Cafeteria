import { describe, it, expect } from 'vitest';
import { carritoReducer, carritoVacio } from './carritoReducer';

const muffin = { id: 19, nombre: 'Muffin de chocolate', precio: 2500 };

describe('carritoReducer', () => {
  it('el carrito empieza vacio', () => {
    expect(carritoVacio.items).toEqual([]);
  });

  it('agregar suma un producto nuevo con cantidad 1', () => {
    const estado = carritoReducer(carritoVacio, { tipo: 'agregar', producto: muffin });
    expect(estado.items).toEqual([
      { productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 1 },
    ]);
  });
});
