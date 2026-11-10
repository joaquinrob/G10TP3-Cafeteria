import { AccionCarrito, EstadoCarrito } from './tipos';

export const carritoVacio: EstadoCarrito = { items: [] };

function cambiarCantidad(estado: EstadoCarrito, productoId: number, diferencia: number): EstadoCarrito {
  return {
    items: estado.items.map((item) =>
      item.productoId === productoId ? { ...item, cantidad: item.cantidad + diferencia } : item,
    ),
  };
}

export function carritoReducer(estado: EstadoCarrito, accion: AccionCarrito): EstadoCarrito {
  if (accion.tipo === 'agregar') {
    const { id, nombre, precio } = accion.producto;
    const yaEsta = estado.items.some((item) => item.productoId === id);
    if (yaEsta) return cambiarCantidad(estado, id, 1);
    return { items: [...estado.items, { productoId: id, nombre, precio, cantidad: 1 }] };
  }
  return estado;
}
