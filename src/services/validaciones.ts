import { ProductoRepository } from '../repositories/ProductoRepository';
import { ESTADOS_VALIDOS, EstadoPedido, ItemPedido } from '../models/Pedido';
import { NoEncontradoError, ValidacionError } from './errors';

export function validarItems(items: any, productos: ProductoRepository): ItemPedido[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidacionError('El pedido debe tener al menos un item');
  }
  return items.map((item) => {
    if (!Number.isInteger(item?.productoId)) {
      throw new ValidacionError('productoId debe ser un numero entero');
    }
    if (!Number.isInteger(item?.cantidad) || item.cantidad <= 0) {
      throw new ValidacionError('cantidad debe ser un entero mayor a 0');
    }
    if (!productos.buscarPorId(item.productoId)) {
      throw new NoEncontradoError(`Producto ${item.productoId} no encontrado`);
    }
    return { productoId: item.productoId, cantidad: item.cantidad };
  });
}

export function validarEstado(estado: any): EstadoPedido {
  if (estado === undefined) return 'pendiente';
  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw new ValidacionError(`estado invalido. Valores posibles: ${ESTADOS_VALIDOS.join(', ')}`);
  }
  return estado;
}
