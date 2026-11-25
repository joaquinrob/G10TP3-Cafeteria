import { describe, it, expect } from 'vitest';
import { claveCarrito, guardarCarrito, leerCarrito } from './persistencia';
import { carritoVacio } from './carritoReducer';
import type { EstadoCarrito } from './tipos';

const carritoConMuffin: EstadoCarrito = {
  items: [{ productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 2 }],
};

/** Almacen en memoria con la misma forma que localStorage. */
function almacenEnMemoria(inicial: Record<string, string> = {}) {
  const datos = new Map(Object.entries(inicial));
  return {
    getItem: (clave: string) => datos.get(clave) ?? null,
    setItem: (clave: string, valor: string) => {
      datos.set(clave, valor);
    },
  };
}

const almacenQueFalla = {
  getItem: (): string | null => {
    throw new Error('almacenamiento bloqueado');
  },
  setItem: (): void => {
    throw new Error('almacenamiento lleno');
  },
};

describe('claveCarrito', () => {
  it('usa una clave distinta para cada mesa', () => {
    expect(claveCarrito(4)).toBe('origen.carrito.mesa-4');
    expect(claveCarrito(7)).toBe('origen.carrito.mesa-7');
  });

  it('sin mesa usa la clave de la barra', () => {
    expect(claveCarrito(null)).toBe('origen.carrito.barra');
  });
});

describe('guardarCarrito y leerCarrito', () => {
  it('lo que se guarda se vuelve a leer igual', () => {
    const almacen = almacenEnMemoria();

    guardarCarrito(almacen, 'clave', carritoConMuffin);

    expect(leerCarrito(almacen, 'clave')).toEqual(carritoConMuffin);
  });

  it('si no hay nada guardado devuelve el carrito vacio', () => {
    expect(leerCarrito(almacenEnMemoria(), 'clave')).toEqual(carritoVacio);
  });

  it('si lo guardado no es JSON devuelve el carrito vacio', () => {
    const almacen = almacenEnMemoria({ clave: '{esto no es json' });

    expect(leerCarrito(almacen, 'clave')).toEqual(carritoVacio);
  });

  it('si lo guardado no tiene la forma de un carrito devuelve el carrito vacio', () => {
    const almacen = almacenEnMemoria({
      clave: JSON.stringify({ items: [{ productoId: 'muffin', cantidad: -1 }] }),
    });

    expect(leerCarrito(almacen, 'clave')).toEqual(carritoVacio);
  });

  it('descarta un item con cantidad cero o negativa', () => {
    const almacen = almacenEnMemoria({
      clave: JSON.stringify({ items: [{ productoId: 19, nombre: 'Muffin de chocolate', precio: 2500, cantidad: 0 }] }),
    });

    expect(leerCarrito(almacen, 'clave')).toEqual(carritoVacio);
  });

  it('si el almacenamiento falla al leer devuelve el carrito vacio', () => {
    expect(leerCarrito(almacenQueFalla, 'clave')).toEqual(carritoVacio);
  });

  it('si el almacenamiento falla al guardar no rompe la app', () => {
    expect(() => guardarCarrito(almacenQueFalla, 'clave', carritoConMuffin)).not.toThrow();
  });
});
