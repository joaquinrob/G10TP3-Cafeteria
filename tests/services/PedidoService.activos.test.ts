import { describe, it, expect, beforeEach } from 'vitest';
import { ProductoRepository } from '../../src/repositories/ProductoRepository';
import { PedidoRepository } from '../../src/repositories/PedidoRepository';
import { PedidoService } from '../../src/services/PedidoService';
import { ValidacionError } from '../../src/services/errors';

const items = [{ productoId: 19, cantidad: 1 }];

describe('PedidoService.listarActivos', () => {
  let service: PedidoService;

  beforeEach(() => {
    service = new PedidoService(new PedidoRepository(), new ProductoRepository());
  });

  it('sin pedidos devuelve una lista vacia', () => {
    expect(service.listarActivos(4)).toEqual([]);
  });

  it('devuelve los pedidos pendientes y en preparacion de la mesa, con su total', () => {
    service.crear({ mesaId: 4, items, estado: 'pendiente' });
    service.crear({ mesaId: 4, items, estado: 'en preparacion' });

    expect(service.listarActivos(4)).toEqual([
      { id: 1, mesaId: 4, items, estado: 'pendiente', total: 2500 },
      { id: 2, mesaId: 4, items, estado: 'en preparacion', total: 2500 },
    ]);
  });

  it('no incluye los pedidos entregados', () => {
    service.crear({ mesaId: 4, items, estado: 'entregado' });
    const activo = service.crear({ mesaId: 4, items });

    expect(service.listarActivos(4)).toEqual([activo]);
  });

  it('no incluye los pedidos de otras mesas', () => {
    service.crear({ mesaId: 5, items });
    const propio = service.crear({ mesaId: 4, items });

    expect(service.listarActivos(4)).toEqual([propio]);
  });

  it('no incluye los pedidos para retirar en la barra (sin mesa)', () => {
    service.crear({ items });

    expect(service.listarActivos(4)).toEqual([]);
  });

  it('los devuelve en orden de creacion (por id)', () => {
    const primero = service.crear({ mesaId: 4, items });
    const segundo = service.crear({ mesaId: 4, items });
    const tercero = service.crear({ mesaId: 4, items });

    expect(service.listarActivos(4).map((p) => p.id)).toEqual([primero.id, segundo.id, tercero.id]);
  });

  it('exige la mesa', () => {
    expect(() => service.listarActivos(undefined)).toThrow(ValidacionError);
    expect(() => service.listarActivos(undefined)).toThrow('mesaId es obligatorio');
  });

  it.each([[0], [-1], [1.5], ['4'], [null]])('rechaza mesaId invalido: %s', (mesaId) => {
    expect(() => service.listarActivos(mesaId)).toThrow(ValidacionError);
  });
});