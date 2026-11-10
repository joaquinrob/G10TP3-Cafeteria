import { describe, it, expect } from 'vitest';
import { ProductoRepository } from '../../src/repositories/ProductoRepository';

describe('ProductoRepository', () => {
  const repo = new ProductoRepository();

  it('tiene 20 productos (9 expresos, 9 filtrados y 2 pastelerias)', () => {
    expect(repo.listar()).toHaveLength(20);
  });

  it('los ids son unicos', () => {
    const ids = repo.listar().map((p) => p.id);
    expect(new Set(ids).size).toBe(20);
  });

  it('buscarPorId devuelve el producto', () => {
    expect(repo.buscarPorId(1)?.nombre).toBe('Expreso Pocillo Brasil');
    expect(repo.buscarPorId(19)?.nombre).toBe('Muffin de chocolate');
    expect(repo.buscarPorId(20)?.nombre).toBe('Torta selva negra');
  });

  it('buscarPorId devuelve undefined si no existe', () => {
    expect(repo.buscarPorId(999)).toBeUndefined();
  });

  it('listar devuelve una copia (no expone el arreglo interno)', () => {
    const copia = repo.listar();
    copia.pop();
    expect(repo.listar()).toHaveLength(20);
  });
});
