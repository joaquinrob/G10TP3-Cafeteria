import { describe, it, expect, beforeEach } from 'vitest';
import { ProductoRepository } from '../../src/repositories/ProductoRepository';
import { PedidoRepository } from '../../src/repositories/PedidoRepository';
import { PedidoService } from '../../src/services/PedidoService';
import { ValidacionError } from '../../src/services/errors';

// ids: 5 = Expreso Mediano Colombia ($7360), 19 = Muffin de chocolate ($2500)
const items = [
  { productoId: 5, cantidad: 2 },
  { productoId: 19, cantidad: 1 },
];

describe('PedidoService con mesa', () => {
  let service: PedidoService;

  beforeEach(() => {
    service = new PedidoService(new PedidoRepository(), new ProductoRepository());
  });

  it('crea el pedido con la mesa y calcula el total', () => {
    const pedido = service.crear({ mesaId: 4, items });
    expect(pedido).toEqual({ id: 1, mesaId: 4, items, estado: 'pendiente', total: 17220 });
  });

  it('sin mesa, el pedido no tiene mesaId (retiro en la barra)', () => {
    const pedido = service.crear({ items });
    expect(pedido).not.toHaveProperty('mesaId');
  });

  it('obtener devuelve el mesaId del pedido', () => {
    const creado = service.crear({ mesaId: 7, items });
    expect(service.obtener(creado.id).mesaId).toBe(7);
  });

  it.each([[0], [-1], [1.5], ['4'], [null]])('rechaza mesaId invalido: %s', (mesaId) => {
    expect(() => service.crear({ mesaId, items })).toThrow(ValidacionError);
  });
});
