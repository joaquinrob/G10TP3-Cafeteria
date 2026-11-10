import { describe, it, expect } from 'vitest';
import { cantidadTotal, estaVacio, itemsParaPedido, subtotalGeneral, subtotalItem } from './selectores';
import { EstadoCarrito } from './tipos';

const estado: EstadoCarrito = {
  items: [
    { productoId: 5, nombre: 'Expreso Mediano Colombia', precio: 7360, cantidad: 2 },
    { productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 1 },
  ],
};

describe('selectores del carrito', () => {
  it('subtotalItem es precio por cantidad', () => {
    const [primero] = estado.items;
    expect(primero && subtotalItem(primero)).toBe(14720);
  });

  it('subtotalGeneral suma los subtotales (orientativo)', () => {
    expect(subtotalGeneral(estado)).toBe(17220);
  });

  it('cantidadTotal suma las cantidades de todos los productos', () => {
    expect(cantidadTotal(estado)).toBe(3);
  });

  it('estaVacio es true solo sin productos', () => {
    expect(estaVacio({ items: [] })).toBe(true);
    expect(estaVacio(estado)).toBe(false);
  });

  it('itemsParaPedido arma el cuerpo de POST /pedidos con productoId y cantidad', () => {
    expect(itemsParaPedido(estado)).toEqual([
      { productoId: 5, cantidad: 2 },
      { productoId: 19, cantidad: 1 },
    ]);
  });
});
