import type { ReactNode } from 'react';
import type { Producto } from '../api/contrato';
import { useMenu } from './useMenu';

interface Props {
  /** Se llama con los productos cuando el menu ya cargo. */
  children: (productos: Producto[]) => ReactNode;
}

export function CargaMenu({ children }: Props) {
  const { menu, reintentar } = useMenu();

  if (menu.estado === 'cargando') {
    return (
      <p role="status" aria-label="Cargando el menu">
        Cargando el menu...
      </p>
    );
  }

  if (menu.estado === 'error') {
    return (
      <div role="alert">
        <p>{menu.mensaje}</p>
        <button type="button" onClick={reintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  return <>{children(menu.productos)}</>;
}
