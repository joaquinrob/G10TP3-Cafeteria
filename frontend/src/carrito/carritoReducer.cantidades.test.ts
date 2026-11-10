import { describe, it, expect } from 'vitest';
import { carritoReducer, carritoVacio } from './carritoReducer';

const muffin = { id: 19, nombre: 'Muffin de chocolate', precio: 2500 };

describe('carritoReducer: sumar, restar y quitar', () => {
  const conDos = carritoReducer(
    carritoReducer(carritoVacio, { tipo: 'agregar', producto: muffin }),
    { tipo: 'agregar', producto: muffin },
  );

  it('sumar aumenta la cantidad en 1', () => {
    const estado = carritoReducer(conDos, { tipo: 'sumar', productoId: 19 });
    expect(estado.items[0]?.cantidad).toBe(3);
  });

  it('restar baja la cantidad en 1', () => {
    const estado = carritoReducer(conDos, { tipo: 'restar', productoId: 19 });
    expect(estado.items[0]?.cantidad).toBe(1);
  });

  it('restar con cantidad 1 quita el producto', () => {
    const conUno = carritoReducer(conDos, { tipo: 'restar', productoId: 19 });
    const estado = carritoReducer(conUno, { tipo: 'restar', productoId: 19 });
    expect(estado.items).toEqual([]);
  });

  it('quitar elimina el producto sin importar la cantidad', () => {
    const estado = carritoReducer(conDos, { tipo: 'quitar', productoId: 19 });
    expect(estado.items).toEqual([]);
  });

  it('quitar un producto que no esta no cambia nada', () => {
    const estado = carritoReducer(conDos, { tipo: 'quitar', productoId: 5 });
    expect(estado).toEqual(conDos);
  });
});
