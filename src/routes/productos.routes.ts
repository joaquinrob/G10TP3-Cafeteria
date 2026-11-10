import { Router } from 'express';
import { ProductoService } from '../services/ProductoService';
import { parseId } from './parseId';

export function productosRouter(service: ProductoService): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(service.listar());
  });

  router.get('/:id', (req, res) => {
    res.json(service.obtener(parseId(req.params.id)));
  });

  return router;
}
