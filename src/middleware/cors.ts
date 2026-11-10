import { NextFunction, Request, Response } from 'express';

/** Habilita CORS para que el front (otro puerto) pueda llamar a la API. */
export function cors(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight: el navegador pregunta antes de hacer el POST
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
}
