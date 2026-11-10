import express from 'express';
import { ProductoRepository } from './repositories/ProductoRepository';
import { PedidoRepository } from './repositories/PedidoRepository';
import { ProductoService } from './services/ProductoService';
import { PedidoService } from './services/PedidoService';
import { ReporteService } from './services/ReporteService';
import { productosRouter } from './routes/productos.routes';
import { pedidosRouter } from './routes/pedidos.routes';
import { reportesRouter } from './routes/reportes.routes';
import { manejarErrores } from './middleware/manejarErrores';

/** Fabrica de la app: cada llamada crea repositorios nuevos (los tests no se pisan). */
export function createApp() {
  const productoRepo = new ProductoRepository();
  const pedidoRepo = new PedidoRepository();

  const productoService = new ProductoService(productoRepo);
  const pedidoService = new PedidoService(pedidoRepo, productoRepo);
  const reporteService = new ReporteService(pedidoRepo, productoRepo, pedidoService);

  const app = express();
  app.use(express.json());

  app.use('/productos', productosRouter(productoService));
  app.use('/pedidos', pedidosRouter(pedidoService));
  app.use('/reportes', reportesRouter(reporteService));

  app.use(manejarErrores);

  return app;
}
