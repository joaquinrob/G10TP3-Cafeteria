import { PedidoRepository } from '../repositories/PedidoRepository';
import { ProductoRepository } from '../repositories/ProductoRepository';
import { PedidoService } from './PedidoService';
import { NoEncontradoError } from './errors';

export class ReporteService {
  constructor(
    private pedidos: PedidoRepository,
    private productos: ProductoRepository,
    private pedidoService: PedidoService,
  ) {}

  /** Suma de los totales de todos los pedidos. */
  facturacionTotal(): number {
    return this.pedidos.listar().reduce((acc, p) => acc + this.pedidoService.calcularTotal(p), 0);
  }

  /** { "Expreso Pocillo Brasil": 10, "Muffin de chocolate": 4, ... } */
  cantidadVendidaPorProducto(): Record<string, number> {
    const resultado: Record<string, number> = {};
    for (const pedido of this.pedidos.listar()) {
      for (const item of pedido.items) {
        const nombre = this.nombreDe(item.productoId);
        resultado[nombre] = (resultado[nombre] ?? 0) + item.cantidad;
      }
    }
    return resultado;
  }

  private nombreDe(productoId: number): string {
    const producto = this.productos.buscarPorId(productoId);
    if (!producto) throw new NoEncontradoError(`Producto ${productoId} no encontrado`);
    return producto.nombre;
  }

  /** Parte del resultado anterior: el producto con mayor cantidad vendida. */
  productoMasVendido(): { producto: string; cantidad: number } {
    const ventas = Object.entries(this.cantidadVendidaPorProducto());
    if (ventas.length === 0) throw new NoEncontradoError('Todavia no hay ventas registradas');
    const [producto, cantidad] = ventas.reduce((max, actual) => (actual[1] > max[1] ? actual : max));
    return { producto, cantidad };
  }
}
