import { useCarrito } from '../carrito/CarritoContext';
import { estaVacio, subtotalGeneral } from '../carrito/selectores';
import { formatearPrecio } from '../utils/precio';
import { FilaCarrito } from './FilaCarrito';

interface Props {
  onConfirmar: () => void;
  /** Mientras se envia el pedido a la API no se puede volver a confirmar. */
  enviando?: boolean;
}

export function Carrito({ onConfirmar, enviando = false }: Props) {
  const { estado, dispatch } = useCarrito();
  const vacio = estaVacio(estado);

  return (
    <section aria-labelledby="titulo-carrito">
      <h2 id="titulo-carrito">Tu pedido</h2>

      {vacio ? (
        <p>Tu carrito esta vacio</p>
      ) : (
        <>
          <ul>
            {estado.items.map((item) => (
              <FilaCarrito key={item.productoId} item={item} dispatch={dispatch} />
            ))}
          </ul>
          <p>Subtotal general: {formatearPrecio(subtotalGeneral(estado))}</p>
        </>
      )}

      <button type="button" disabled={vacio || enviando} onClick={onConfirmar}>
        {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
      </button>
    </section>
  );
}
