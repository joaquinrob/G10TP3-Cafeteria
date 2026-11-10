import { useCarrito } from '../carrito/CarritoContext';
import { estaVacio, subtotalGeneral, subtotalItem } from '../carrito/selectores';
import { formatearPrecio } from '../utils/precio';

interface Props {
  onConfirmar: () => void;
}

export function Carrito({ onConfirmar }: Props) {
  const { estado } = useCarrito();
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
              <li key={item.productoId}>
                <span>{item.nombre}</span>
                <span>Cantidad: {item.cantidad}</span>
                <span>Subtotal: {formatearPrecio(subtotalItem(item))}</span>
              </li>
            ))}
          </ul>
          <p>Subtotal general: {formatearPrecio(subtotalGeneral(estado))}</p>
        </>
      )}

      <button type="button" disabled={vacio} onClick={onConfirmar}>
        Confirmar pedido
      </button>
    </section>
  );
}
