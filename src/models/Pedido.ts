export type EstadoPedido = 'pendiente' | 'en preparacion' | 'entregado';

export const ESTADOS_VALIDOS: EstadoPedido[] = ['pendiente', 'en preparacion', 'entregado'];

export interface ItemPedido {
  productoId: number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  mesaId?: number;
  items: ItemPedido[];
  estado: EstadoPedido;
}

/** Pedido + total calculado (lo que devuelve la API). */
export interface PedidoConTotal extends Pedido {
  total: number;
}
