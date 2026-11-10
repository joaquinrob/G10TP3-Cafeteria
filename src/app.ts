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
import { rutaNoEncontrada } from './middleware/rutaNoEncontrada';
import { cors } from './middleware/cors';
import { testRouter } from './routes/test.routes';

/** Fabrica de la app: cada llamada crea repositorios nuevos (los tests no se pisan). */
export function createApp() {
  const productoRepo = new ProductoRepository();
  const pedidoRepo = new PedidoRepository();

  const productoService = new ProductoService(productoRepo);
  const pedidoService = new PedidoService(pedidoRepo, productoRepo);
  const reporteService = new ReporteService(pedidoRepo, productoRepo, pedidoService);

  const app = express();
  app.use(cors);
  app.use(express.json());

  app.use('/productos', productosRouter(productoService));
  app.use('/pedidos', pedidosRouter(pedidoService));
  app.use('/reportes', reportesRouter(reporteService));

  if (process.env.NODE_ENV === 'test') {
    app.use('/__test__', testRouter(pedidoRepo, pedidoService));
  }

  app.use(rutaNoEncontrada);
  app.use(manejarErrores);

  return app;
}
