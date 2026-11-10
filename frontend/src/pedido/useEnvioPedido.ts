import { useCallback, useState } from 'react';
import { crearPedido } from '../api/cliente';
import type { Pedido } from '../api/contrato';
import { mensajeDeError } from '../menu/mensajeDeError';

export type EstadoEnvio =
  | { estado: 'inactivo' }
  | { estado: 'enviando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'confirmado'; pedido: Pedido };

export function useEnvioPedido(mesa: number | null) {
  const [envio, setEnvio] = useState<EstadoEnvio>({ estado: 'inactivo' });

  /** Devuelve true si la API confirmo el pedido; si lo rechazo, guarda el mensaje y devuelve false. */
  const confirmar = useCallback(
    async (items: { productoId: number; cantidad: number }[]): Promise<boolean> => {
      setEnvio({ estado: 'enviando' });
      try {
        const pedido = await crearPedido({ mesaId: mesa, items });
        setEnvio({ estado: 'confirmado', pedido });
        return true;
      } catch (error) {
        setEnvio({ estado: 'error', mensaje: mensajeDeError(error) });
        return false;
      }
    },
    [mesa],
  );

  const reiniciar = useCallback(() => setEnvio({ estado: 'inactivo' }), []);

  return { envio, confirmar, reiniciar };
}
