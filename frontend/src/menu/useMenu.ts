import { useCallback, useEffect, useState } from 'react';
import { obtenerProductos } from '../api/cliente';
import type { Producto } from '../api/contrato';
import { mensajeDeError } from './mensajeDeError';

export type EstadoMenu =
  | { estado: 'cargando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'listo'; productos: Producto[] };

export function useMenu() {
  const [menu, setMenu] = useState<EstadoMenu>({ estado: 'cargando' });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setMenu({ estado: 'cargando' });

    obtenerProductos().then(
      (productos) => {
        if (!cancelado) setMenu({ estado: 'listo', productos });
      },
      (error: unknown) => {
        if (!cancelado) setMenu({ estado: 'error', mensaje: mensajeDeError(error) });
      },
    );

    return () => {
      cancelado = true;
    };
  }, [intento]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  return { menu, reintentar };
}
