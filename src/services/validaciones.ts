import { ProductoRepository } from '../repositories/ProductoRepository';
import { ESTADOS_VALIDOS, EstadoPedido, ItemPedido } from '../models/Pedido';
import { NoEncontradoError, ValidacionError } from './errors';

export function validarItems(items: unknown, productos: ProductoRepository): ItemPedido[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidacionError('El pedido debe tener al menos un item');
  }
  return items.map((item: { productoId?: unknown; cantidad?: unknown } | null) => {
    const productoId = item?.productoId;
    const cantidad = item?.cantidad;
    if (typeof productoId !== 'number' || !Number.isInteger(productoId)) {
      throw new ValidacionError('productoId debe ser un numero entero');
    }
    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad <= 0) {
      throw new ValidacionError('cantidad debe ser un entero mayor a 0');
    }
    if (!productos.buscarPorId(productoId)) {
      throw new NoEncontradoError(`Producto ${productoId} no encontrado`);
    }
    return { productoId, cantidad };
  });
}

export function validarEstado(estado: unknown): EstadoPedido {
  if (estado === undefined) return 'pendiente';
  if (!ESTADOS_VALIDOS.includes(estado as EstadoPedido)) {
    throw new ValidacionError(`estado invalido. Valores posibles: ${ESTADOS_VALIDOS.join(', ')}`);
  }
  return estado as EstadoPedido;
}

/** La mesa es opcional; si viene, tiene que ser un entero mayor a 0. */
export function validarMesa(mesaId: unknown): number | undefined {
  if (mesaId === undefined) return undefined;
  if (typeof mesaId !== 'number' || !Number.isInteger(mesaId) || mesaId <= 0) {
    throw new ValidacionError('mesaId debe ser un entero mayor a 0');
  }
  return mesaId;
}
