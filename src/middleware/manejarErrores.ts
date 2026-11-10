import { NextFunction, Request, Response } from 'express';
import { NoEncontradoError, ValidacionError } from '../services/errors';

/** Manejo centralizado de errores: siempre responde { error: "mensaje" }. */
export function manejarErrores(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ValidacionError) return res.status(400).json({ error: err.message });
  if (err instanceof NoEncontradoError) return res.status(404).json({ error: err.message });
  if (err instanceof SyntaxError) return res.status(400).json({ error: 'JSON invalido' });

  // Errores HTTP de las librerias (por ejemplo, cuerpo demasiado grande)
  const status = (err as { status?: unknown }).status;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    const mensaje = status === 413 ? 'El cuerpo de la solicitud es demasiado grande' : 'Solicitud invalida';
    return res.status(status).json({ error: mensaje });
  }

  return res.status(500).json({ error: 'Error interno del servidor' });
}
