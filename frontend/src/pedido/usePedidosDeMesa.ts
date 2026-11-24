import { useCallback, useEffect, useRef, useState } from 'react';
import { obtenerPedidosActivos } from '../api/cliente';
import type { Pedido } from '../api/contrato';
import { mensajeDeError } from '../menu/mensajeDeError';

export function usePedidosDeMesa(mesa: number) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actualizando, setActualizando] = useState(false);
  
  const ultimaConsulta = useRef(0);

  const actualizar = useCallback(async () => {
    const numero = ++ultimaConsulta.current;
    setActualizando(true);
    try {
      const actuales = await obtenerPedidosActivos(mesa);
      if (numero !== ultimaConsulta.current) return;
      setPedidos(actuales);
      setError(null);
    } catch (falla) {
      if (numero !== ultimaConsulta.current) return;
      setError(mensajeDeError(falla));
    } finally {
      if (numero === ultimaConsulta.current) setActualizando(false);
    }
  }, [mesa]);

  useEffect(() => {
    void actualizar();
  }, [actualizar]);

  return { pedidos, error, actualizando, actualizar };
}