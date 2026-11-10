import { describe, it, expect } from 'vitest';
import { errorApiSchema, pedidoSchema } from './contrato';
import { pedidoMesa4 } from '../test/fixtures';

describe('contrato de pedido', () => {
  it('acepta un pedido con mesa, items, estado y total', () => {
    expect(pedidoSchema.parse(pedidoMesa4)).toEqual(pedidoMesa4);
  });

  it('acepta un pedido sin mesa (retiro en la barra)', () => {
    const { mesaId: _mesaId, ...sinMesa } = pedidoMesa4;
    expect(pedidoSchema.parse(sinMesa)).toEqual(sinMesa);
  });

  it.each([['pendiente'], ['en preparacion'], ['entregado']])('acepta el estado %s', (estado) => {
    expect(pedidoSchema.safeParse({ ...pedidoMesa4, estado }).success).toBe(true);
  });

  it('rechaza un estado desconocido', () => {
    expect(pedidoSchema.safeParse({ ...pedidoMesa4, estado: 'cancelado' }).success).toBe(false);
  });

  it('rechaza un pedido sin total', () => {
    const { total: _total, ...sinTotal } = pedidoMesa4;
    expect(pedidoSchema.safeParse(sinTotal).success).toBe(false);
  });
});

describe('contrato de error', () => {
  it('acepta { error: mensaje }', () => {
    expect(errorApiSchema.parse({ error: 'Producto 999 no encontrado' })).toEqual({
      error: 'Producto 999 no encontrado',
    });
  });

  it('rechaza una respuesta sin error', () => {
    expect(errorApiSchema.safeParse({ mensaje: 'algo' }).success).toBe(false);
  });
});
