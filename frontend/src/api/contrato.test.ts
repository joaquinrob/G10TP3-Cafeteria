import { describe, it, expect } from 'vitest';
import { productoSchema, productosSchema } from './contrato';
import { expresoMedianoColombia, muffin } from '../test/fixtures';

describe('contrato de producto', () => {
  it('acepta un cafe con tamanio, gramos y variedad', () => {
    expect(productoSchema.parse(expresoMedianoColombia)).toEqual(expresoMedianoColombia);
  });

  it('acepta una pasteleria sin datos de cafe', () => {
    expect(productoSchema.parse(muffin)).toEqual(muffin);
  });

  it('acepta una lista de productos', () => {
    expect(productosSchema.parse([expresoMedianoColombia, muffin])).toHaveLength(2);
  });

  it('rechaza un precio que no es numero', () => {
    const roto = { ...muffin, precio: '2500' };
    expect(productoSchema.safeParse(roto).success).toBe(false);
  });

  it('rechaza un tipo desconocido', () => {
    const roto = { ...muffin, tipo: 'sandwich' };
    expect(productoSchema.safeParse(roto).success).toBe(false);
  });

  it('rechaza un cafe sin variedad', () => {
    const { variedad: _variedad, ...sinVariedad } = expresoMedianoColombia;
    expect(productoSchema.safeParse(sinVariedad).success).toBe(false);
  });
});
