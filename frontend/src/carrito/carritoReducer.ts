import { AccionCarrito, EstadoCarrito } from './tipos';

export const carritoVacio: EstadoCarrito = { items: [] };

export function carritoReducer(estado: EstadoCarrito, accion: AccionCarrito): EstadoCarrito {
  if (accion.tipo === 'agregar') {
    const { id, nombre, precio } = accion.producto;
    const yaEsta = estado.items.some((item) => item.productoId === id);
    if (yaEsta) {
      return {
        items: estado.items.map((item) =>
          item.productoId === id ? { ...item, cantidad: item.cantidad + 1 } : item,
        ),
      };
    }
    return { items: [...estado.items, { productoId: id, nombre, precio, cantidad: 1 }] };
  }
  return estado;
}
