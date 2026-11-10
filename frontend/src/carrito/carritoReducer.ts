import { AccionCarrito, EstadoCarrito } from './tipos';

export const carritoVacio: EstadoCarrito = { items: [] };

export function carritoReducer(estado: EstadoCarrito, accion: AccionCarrito): EstadoCarrito {
  if (accion.tipo === 'agregar') {
    const { id, nombre, precio } = accion.producto;
    return { items: [...estado.items, { productoId: id, nombre, precio, cantidad: 1 }] };
  }
  return estado;
}
