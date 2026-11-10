import { Router } from 'express';
import { ReporteService } from '../services/ReporteService';

export function reportesRouter(service: ReporteService): Router {
  const router = Router();

  router.get('/facturacion', (_req, res) => {
    res.json({ facturacionTotal: service.facturacionTotal() });
  });

  router.get('/mas-vendido', (_req, res) => {
    res.json(service.productoMasVendido());
  });

  return router;
}
