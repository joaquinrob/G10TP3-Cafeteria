import { Router } from 'express';
import { PedidoRepository } from '../repositories/PedidoRepository';
import { PedidoService } from '../services/PedidoService';
import { ValidacionError } from '../services/errors';

/** Pedido que carga /seed cuando no se le pasan datos. */
const PEDIDOS_SEMILLA = [{ mesaId: 9, items: [{ productoId: 19, cantidad: 1 }], estado: 'entregado' }];

/** Endpoints de apoyo para los E2E. Solo se montan con NODE_ENV=test. */
export function testRouter(pedidoRepo: PedidoRepository, pedidoService: PedidoService): Router {
  const router = Router();

  router.post('/reset', (_req, res) => {
    pedidoRepo.reiniciar();
    res.status(204).end();
  });

  router.post('/seed', (req, res) => {
    const entrada: unknown = req.body?.pedidos ?? PEDIDOS_SEMILLA;
    if (!Array.isArray(entrada)) throw new ValidacionError('pedidos debe ser una lista');

    pedidoRepo.reiniciar();
    const pedidos = entrada.map((p) => pedidoService.crear(p));
    res.status(201).json({ pedidos });
  });

  return router;
}
