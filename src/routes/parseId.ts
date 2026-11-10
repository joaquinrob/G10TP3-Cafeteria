import { ValidacionError } from '../services/errors';

/** Convierte el parametro :id a numero entero o lanza ValidacionError. */
export function parseId(valor: string): number {
  const id = Number(valor);
  if (!Number.isInteger(id)) throw new ValidacionError('El id debe ser un numero entero');
  return id;
}
