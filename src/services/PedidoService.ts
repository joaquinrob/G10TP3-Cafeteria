import { PedidoRepository } from '../repositories/PedidoRepository';
import { ProductoRepository } from '../repositories/ProductoRepository';
import { Pedido, PedidoConTotal } from '../models/Pedido';
import { NoEncontradoError } from './errors';
import { validarEstado, validarItems, validarMesa } from './validaciones';

export class PedidoService {
  constructor(
    private pedidos: PedidoRepository,
    private productos: ProductoRepository,
  ) {}

  /** Total = suma de calcularPrecio() x cantidad de cada item. */
  calcularTotal(pedido: Pedido): number {
    return pedido.items.reduce((total, item) => {
      const producto = this.productos.buscarPorId(item.productoId);
      if (!producto) throw new NoEncontradoError(`Producto ${item.productoId} no encontrado`);
      return total + producto.calcularPrecio() * item.cantidad;
    }, 0);
  }

  private conTotal(pedido: Pedido): PedidoConTotal {
    return { ...pedido, total: this.calcularTotal(pedido) };
  }

  crear(body: any): PedidoConTotal {
    const items = validarItems(body?.items, this.productos);
    const estado = validarEstado(body?.estado);
    const mesaId = validarMesa(body?.mesaId);
    const pedido = this.pedidos.crear({ items, estado, ...(mesaId !== undefined && { mesaId }) });
    return this.conTotal(pedido);
  }

  listar(): PedidoConTotal[] {
    return this.pedidos.listar().map((p) => this.conTotal(p));
  }

  obtener(id: number): PedidoConTotal {
    const pedido = this.pedidos.buscarPorId(id);
    if (!pedido) throw new NoEncontradoError(`Pedido ${id} no encontrado`);
    return this.conTotal(pedido);
  }
}
