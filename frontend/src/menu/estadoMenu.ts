import type { Producto } from '../api/contrato';

/** Estado de la carga del menu: una union discriminada por `estado`. */
export type EstadoMenu =
  | { estado: 'cargando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'listo'; productos: Producto[] };
