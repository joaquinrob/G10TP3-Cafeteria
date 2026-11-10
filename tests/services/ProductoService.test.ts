import { describe, it, expect } from 'vitest';
import { ProductoRepository } from '../../src/repositories/ProductoRepository';
import { ProductoService } from '../../src/services/ProductoService';
import { NoEncontradoError } from '../../src/services/errors';

describe('ProductoService', () => {
  const service = new ProductoService(new ProductoRepository());

  it('listar devuelve los 20 productos con su precio calculado', () => {
    const lista = service.listar();
    expect(lista).toHaveLength(20);
    expect(lista[0]).toEqual({ id: 1, nombre: 'Expreso Pocillo Brasil', precioBase: 2500, precio: 5020 });
  });

  it('obtener devuelve el producto pedido', () => {
    expect(service.obtener(20)).toEqual({ id: 20, nombre: 'Torta selva negra', precioBase: 4200, precio: 4200 });
  });

  it('obtener lanza NoEncontradoError si no existe', () => {
    expect(() => service.obtener(999)).toThrow(NoEncontradoError);
  });
});
