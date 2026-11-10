import type { Pedido } from '../api/contrato';

/** Estado del envio del pedido a la API: una union discriminada por `estado`. */
export type EstadoEnvio =
  | { estado: 'inactivo' }
  | { estado: 'enviando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'confirmado'; pedido: Pedido };
