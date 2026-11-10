import { ErrorApi, ErrorContrato, ErrorRed } from '../api/errores';

const MENSAJE_GENERICO = 'Ocurrio un error inesperado. Intenta de nuevo.';

/** Mensaje claro para mostrarle al cliente. Los errores inesperados no muestran su detalle interno. */
export function mensajeDeError(error: unknown): string {
  if (error instanceof ErrorApi || error instanceof ErrorRed || error instanceof ErrorContrato) {
    return error.message;
  }
  return MENSAJE_GENERICO;
}
