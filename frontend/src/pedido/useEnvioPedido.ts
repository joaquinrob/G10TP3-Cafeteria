import { useCallback, useState } from 'react';
import { crearPedido } from '../api/cliente';
import type { Pedido } from '../api/contrato';

export type EstadoEnvio =
  | { estado: 'inactivo' }
  | { estado: 'enviando' }
  | { estado: 'confirmado'; pedido: Pedido };

export function useEnvioPedido(mesa: number | null) {
  const [envio, setEnvio] = useState<EstadoEnvio>({ estado: 'inactivo' });

  const confirmar = useCallback(
    async (items: { productoId: number; cantidad: number }[]): Promise<boolean> => {
      setEnvio({ estado: 'enviando' });
      const pedido = await crearPedido({ mesaId: mesa, items });
      setEnvio({ estado: 'confirmado', pedido });
      return true;
    },
    [mesa],
  );

  const reiniciar = useCallback(() => setEnvio({ estado: 'inactivo' }), []);

  return { envio, confirmar, reiniciar };
}
