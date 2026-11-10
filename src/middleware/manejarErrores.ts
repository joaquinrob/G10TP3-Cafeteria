import { NextFunction, Request, Response } from 'express';
import { NoEncontradoError, ValidacionError } from '../services/errors';

/** Manejo centralizado de errores: siempre responde { error: "mensaje" }. */
export function manejarErrores(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ValidacionError) return res.status(400).json({ error: err.message });
  if (err instanceof NoEncontradoError) return res.status(404).json({ error: err.message });
  if (err instanceof SyntaxError) return res.status(400).json({ error: 'JSON invalido' });
  return res.status(500).json({ error: 'Error interno del servidor' });
}
