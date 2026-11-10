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
      <h2 id="titulo-carrito" className="h4">
        Tu pedido
      </h2>

      {vacio ? (
        <p className="text-secondary">Tu carrito esta vacio</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {estado.items.map((item) => (
              <FilaCarrito key={item.productoId} item={item} dispatch={dispatch} />
            ))}
          </ul>
          <p className="fw-bold">Subtotal general: {formatearPrecio(subtotalGeneral(estado))}</p>
        </>
      )}

      <button type="button" className="btn btn-primary w-100" disabled={vacio || enviando} onClick={onConfirmar}>
        {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
      </button>
    </section>
  );
}
