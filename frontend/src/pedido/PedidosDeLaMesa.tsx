import { formatearPrecio } from '../utils/precio';
import { usePedidosDeMesa } from './usePedidosDeMesa';

interface Props {
  mesa: number;
}

/** Todos los pedidos de la mesa que siguen pendientes o en preparacion. */
export function PedidosDeLaMesa({ mesa }: Props) {
  const { pedidos, error, actualizando, actualizar } = usePedidosDeMesa(mesa);

  // Sin pedidos en curso (y sin error que mostrar) no hay nada que ver.
  if (pedidos.length === 0 && error === null) return null;

  return (
    <section aria-labelledby="titulo-pedidos-mesa" className="card card-body mb-3">
      <h2 id="titulo-pedidos-mesa" className="h5">
        Pedidos de tu mesa
      </h2>
      {error && (
        <p role="alert" className="alert alert-danger">
          {error}
        </p>
      )}
      {pedidos.length > 0 && (
        <ul className="list-group list-group-flush mb-2">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
              <span className="fw-bold">#{pedido.id}</span>
              <span className="badge text-bg-secondary">{pedido.estado}</span>
              <span>{formatearPrecio(pedido.total)}</span>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="btn btn-outline-primary w-100" disabled={actualizando} onClick={actualizar}>
        {actualizando ? 'Actualizando...' : 'Actualizar pedidos'}
      </button>
    </section>
  );
}