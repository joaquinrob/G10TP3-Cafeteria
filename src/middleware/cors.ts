import { NextFunction, Request, Response } from 'express';

const ORIGEN_PERMITIDO = '*';
const METODOS_PERMITIDOS = 'GET,POST,OPTIONS';
const HEADERS_PERMITIDOS = 'Content-Type';

/** Habilita CORS para que el front (otro puerto) pueda llamar a la API. */
export function cors(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', ORIGEN_PERMITIDO);
  res.setHeader('Access-Control-Allow-Methods', METODOS_PERMITIDOS);
  res.setHeader('Access-Control-Allow-Headers', HEADERS_PERMITIDOS);

  // Preflight: el navegador pregunta antes de hacer el POST
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
}
