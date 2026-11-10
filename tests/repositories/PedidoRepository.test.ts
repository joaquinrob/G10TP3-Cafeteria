import { describe, it, expect } from 'vitest';
import { PedidoRepository } from '../../src/repositories/PedidoRepository';

const datos = { items: [{ productoId: 19, cantidad: 1 }], estado: 'pendiente' as const };

describe('PedidoRepository', () => {
  it('asigna ids incrementales desde 1', () => {
    const repo = new PedidoRepository();
    expect(repo.crear(datos).id).toBe(1);
    expect(repo.crear(datos).id).toBe(2);
  });

  it('reiniciar borra los pedidos y vuelve a numerar desde 1', () => {
    const repo = new PedidoRepository();
    repo.crear(datos);
    repo.crear(datos);

    repo.reiniciar();

    expect(repo.listar()).toHaveLength(0);
    expect(repo.crear(datos).id).toBe(1);
  });
});
