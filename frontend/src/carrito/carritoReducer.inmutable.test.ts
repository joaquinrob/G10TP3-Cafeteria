import { describe, it, expect } from 'vitest';
import { carritoReducer, carritoVacio } from './carritoReducer';

describe('carritoReducer es una funcion pura', () => {
  it('no modifica el estado anterior', () => {
    const antes = carritoReducer(carritoVacio, {
      tipo: 'agregar',
      producto: { id: 19, nombre: 'Muffin de chocolate', precio: 2500 },
    });
    const copia = structuredClone(antes);

    carritoReducer(antes, { tipo: 'sumar', productoId: 19 });
    carritoReducer(antes, { tipo: 'quitar', productoId: 19 });
    carritoReducer(antes, { tipo: 'vaciar' });

    expect(antes).toEqual(copia);
    expect(carritoVacio.items).toEqual([]);
  });
});
