import { EstadoCarrito, ItemCarrito } from './tipos';

/** Subtotal de un item. Es solo orientativo: el total real lo calcula la API. */
export function subtotalItem(item: ItemCarrito): number {
  return item.precio * item.cantidad;
}

export function subtotalGeneral(estado: EstadoCarrito): number {
  return estado.items.reduce((total, item) => total + subtotalItem(item), 0);
}

export function cantidadTotal(estado: EstadoCarrito): number {
  return estado.items.reduce((total, item) => total + item.cantidad, 0);
}

export function estaVacio(estado: EstadoCarrito): boolean {
  return estado.items.length === 0;
}

/** Items en el formato que espera POST /pedidos: solo productoId y cantidad. */
export function itemsParaPedido(estado: EstadoCarrito): { productoId: number; cantidad: number }[] {
  return estado.items.map(({ productoId, cantidad }) => ({ productoId, cantidad }));
}
