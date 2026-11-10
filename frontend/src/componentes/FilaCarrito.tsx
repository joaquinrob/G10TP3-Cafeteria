import type { Dispatch } from 'react';
import { subtotalItem } from '../carrito/selectores';
import type { AccionCarrito, ItemCarrito } from '../carrito/tipos';
import { formatearPrecio } from '../utils/precio';

interface Props {
  item: ItemCarrito;
  dispatch: Dispatch<AccionCarrito>;
}

/** Una linea del carrito: producto, cantidad, subtotal y los botones para sumar, restar y quitar. */
export function FilaCarrito({ item, dispatch }: Props) {
  const { productoId, nombre, cantidad } = item;

  return (
    <li>
      <span>{nombre}</span>
      <span>Cantidad: {cantidad}</span>
      <span>Subtotal: {formatearPrecio(subtotalItem(item))}</span>
      <button type="button" aria-label={`Restar ${nombre}`} onClick={() => dispatch({ tipo: 'restar', productoId })}>
        -
      </button>
      <button type="button" aria-label={`Sumar ${nombre}`} onClick={() => dispatch({ tipo: 'sumar', productoId })}>
        +
      </button>
      <button type="button" aria-label={`Quitar ${nombre}`} onClick={() => dispatch({ tipo: 'quitar', productoId })}>
        Quitar
      </button>
    </li>
  );
}
