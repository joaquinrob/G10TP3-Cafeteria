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
    <section aria-labelledby="titulo-confirmado">
      <h2 id="titulo-confirmado">Pedido confirmado</h2>
      <p>Pedido #{actual.id}</p>
      <p>Estado: {actual.estado}</p>
      <p>Total: {formatearPrecio(actual.total)}</p>
      {error && <p role="alert">{error}</p>}
      <button type="button" disabled={actualizando} onClick={actualizar}>
        Actualizar estado
      </button>
      <button type="button" onClick={onNuevoPedido}>
        Hacer otro pedido
      </button>
    </section>
  );
}
