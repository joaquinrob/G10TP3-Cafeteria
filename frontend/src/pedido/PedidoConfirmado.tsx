import { useState } from 'react';
import { obtenerPedido } from '../api/cliente';
import type { Pedido } from '../api/contrato';
import { mensajeDeError } from '../menu/mensajeDeError';
import { formatearPrecio } from '../utils/precio';

interface Props {
  pedido: Pedido;
  onNuevoPedido: () => void;
}

export function PedidoConfirmado({ pedido, onNuevoPedido }: Props) {
  const [actual, setActual] = useState<Pedido>(pedido);
  const [error, setError] = useState<string | null>(null);
  const [actualizando, setActualizando] = useState(false);

  async function actualizar() {
    setActualizando(true);
    setError(null);
    try {
      setActual(await obtenerPedido(actual.id));
    } catch (falla) {
      setError(mensajeDeError(falla));
    } finally {
      setActualizando(false);
    }
  }

  return (
    <section aria-labelledby="titulo-confirmado" className="card card-body">
      <h2 id="titulo-confirmado" className="h4">
        Pedido confirmado
      </h2>
      <p className="mb-1">Pedido #{actual.id}</p>
      <p className="mb-1">Estado: {actual.estado}</p>
      <p className="fw-bold">Total: {formatearPrecio(actual.total)}</p>
      {error && (
        <p role="alert" className="alert alert-danger">
          {error}
        </p>
      )}
      <button type="button" className="btn btn-primary w-100 mb-2" disabled={actualizando} onClick={actualizar}>
        Actualizar estado
      </button>
      <button type="button" className="btn btn-outline-secondary w-100" onClick={onNuevoPedido}>
        Hacer otro pedido
      </button>
    </section>
  );
}
