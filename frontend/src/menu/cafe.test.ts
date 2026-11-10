import { describe, it, expect } from 'vitest';
import { productosSchema } from '../api/contrato';
import { expresoMedianoColombia, muffin } from '../test/fixtures';
import { buscarCafe, esCafe } from './cafe';

const variedadEtiopia = {
  nombre: 'Etiopia',
  descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
};

const productos = productosSchema.parse([
  expresoMedianoColombia,
  { ...expresoMedianoColombia, id: 6, nombre: 'Expreso Mediano Etiopia', variedad: variedadEtiopia, precio: 8980 },
  { ...expresoMedianoColombia, id: 14, tipo: 'filtrado', nombre: 'Filtrado Mediano Colombia', precio: 5900 },
  muffin,
]);

describe('buscarCafe', () => {
  it('encuentra el expreso mediano de Colombia', () => {
    const cafe = buscarCafe(productos, { bebida: 'expreso', tamanio: 'Mediano', origen: 'Colombia' });
    expect(cafe?.id).toBe(5);
    expect(cafe?.precio).toBe(7360);
  });

  it('distingue la bebida: el filtrado mediano de Colombia es otro producto', () => {
    const cafe = buscarCafe(productos, { bebida: 'filtrado', tamanio: 'Mediano', origen: 'Colombia' });
    expect(cafe?.id).toBe(14);
  });

  it('distingue el origen', () => {
    const cafe = buscarCafe(productos, { bebida: 'expreso', tamanio: 'Mediano', origen: 'Etiopia' });
    expect(cafe?.id).toBe(6);
  });

  it('devuelve undefined si no hay un cafe con esa eleccion', () => {
    expect(buscarCafe(productos, { bebida: 'expreso', tamanio: 'Pocillo', origen: 'Colombia' })).toBeUndefined();
    expect(buscarCafe([], { bebida: 'expreso', tamanio: 'Mediano', origen: 'Colombia' })).toBeUndefined();
  });
});

describe('esCafe', () => {
  it('es true para expresos y filtrados', () => {
    expect(productos.filter(esCafe)).toHaveLength(3);
  });

  it('es false para la pasteleria', () => {
    const pasteleria = productos.find((p) => p.tipo === 'pasteleria');
    expect(pasteleria && esCafe(pasteleria)).toBe(false);
  });
});
