import { Request, Response } from 'express';

/** Ultima ruta antes del manejador de errores: todo lo que no existe responde 404. */
export function rutaNoEncontrada(_req: Request, res: Response) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}
