import { describe, it, expect } from 'vitest';
import { carritoReducer, carritoVacio } from './carritoReducer';

describe('carritoReducer: vaciar', () => {
  it('vaciar deja el carrito vacio', () => {
    const conProducto = carritoReducer(carritoVacio, {
      tipo: 'agregar',
      producto: { id: 19, nombre: 'Muffin de chocolate', precio: 2500 },
    });
    const estado = carritoReducer(conProducto, { tipo: 'vaciar' });
    expect(estado.items).toEqual([]);
  });
});
