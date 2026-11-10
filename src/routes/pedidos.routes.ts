import { Router } from 'express';
import { PedidoService } from '../services/PedidoService';
import { parseId } from './parseId';

export function pedidosRouter(service: PedidoService): Router {
  const router = Router();

  router.post('/', (req, res) => {
    res.status(201).json(service.crear(req.body));
  });

  router.get('/', (_req, res) => {
    res.json(service.listar());
  });

  router.get('/:id', (req, res) => {
    res.json(service.obtener(parseId(req.params.id)));
  });

  return router;
}
