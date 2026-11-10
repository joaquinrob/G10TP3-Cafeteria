import { NextFunction, Request, Response } from 'express';
import { NoEncontradoError, ValidacionError } from '../services/errors';

/** Toda respuesta de error de la API tiene el formato { error: "mensaje" }. */
function responderError(res: Response, status: number, mensaje: string) {
  return res.status(status).json({ error: mensaje });
}

/** Status 4xx que ponen las librerias (por ejemplo, cuerpo demasiado grande). */
function statusHttpDeLibreria(err: Error): number | undefined {
  const status = (err as { status?: unknown }).status;
  return typeof status === 'number' && status >= 400 && status < 500 ? status : undefined;
}

/** Manejo centralizado de errores: siempre responde { error: "mensaje" }. */
export function manejarErrores(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ValidacionError) return responderError(res, 400, err.message);
  if (err instanceof NoEncontradoError) return responderError(res, 404, err.message);
  if (err instanceof SyntaxError) return responderError(res, 400, 'JSON invalido');

  const status = statusHttpDeLibreria(err);
  if (status === 413) return responderError(res, 413, 'El cuerpo de la solicitud es demasiado grande');
  if (status !== undefined) return responderError(res, status, 'Solicitud invalida');

  return responderError(res, 500, 'Error interno del servidor');
}
