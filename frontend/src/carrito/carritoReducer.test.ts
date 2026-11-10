import { describe, it, expect } from 'vitest';
import { carritoReducer, carritoVacio } from './carritoReducer';

const muffin = { id: 19, nombre: 'Muffin de chocolate', precio: 2500 };
const expreso = { id: 5, nombre: 'Expreso Mediano Colombia', precio: 7360 };

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

  it('agregar el mismo producto otra vez suma la cantidad', () => {
    let estado = carritoReducer(carritoVacio, { tipo: 'agregar', producto: muffin });
    estado = carritoReducer(estado, { tipo: 'agregar', producto: muffin });
    expect(estado.items).toEqual([
      { productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 2 },
    ]);
  });

  it('agregar productos distintos los deja en el orden en que se agregaron', () => {
    let estado = carritoReducer(carritoVacio, { tipo: 'agregar', producto: expreso });
    estado = carritoReducer(estado, { tipo: 'agregar', producto: muffin });
    expect(estado.items.map((i) => i.productoId)).toEqual([5, 19]);
  });
});
