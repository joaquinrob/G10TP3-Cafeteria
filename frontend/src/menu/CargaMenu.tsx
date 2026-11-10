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
      <p role="status" aria-label="Cargando el menu" className="text-center py-4">
        Cargando el menu...
      </p>
    );
  }

  if (menu.estado === 'error') {
    return (
      <div role="alert" className="alert alert-danger">
        <p>{menu.mensaje}</p>
        <button type="button" className="btn btn-danger" onClick={reintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  return <>{children(menu.productos)}</>;
}
