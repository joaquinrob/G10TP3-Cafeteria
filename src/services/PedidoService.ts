import { PedidoRepository } from '../repositories/PedidoRepository';
import { ProductoRepository } from '../repositories/ProductoRepository';
import { ESTADOS_ACTIVOS, Pedido, PedidoConTotal } from '../models/Pedido';
import { NoEncontradoError, ValidacionError } from './errors';
import { validarEstado, validarItems, validarMesa } from './validaciones';

/** Cuerpo de POST /pedidos: llega sin validar, por eso los campos son unknown. */
export interface CrearPedidoBody {
  items?: unknown;
  estado?: unknown;
  mesaId?: unknown;
}

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

  crear(body: CrearPedidoBody | undefined): PedidoConTotal {
    const items = validarItems(body?.items, this.productos);
    const estado = validarEstado(body?.estado);
    const mesaId = validarMesa(body?.mesaId);
    const pedido = this.pedidos.crear({ items, estado, ...(mesaId !== undefined && { mesaId }) });
    return this.conTotal(pedido);
  }

  listar(): PedidoConTotal[] {
    return this.pedidos.listar().map((p) => this.conTotal(p));
  }

  listarActivos(mesaId: unknown): PedidoConTotal[] {
    const mesa = validarMesa(mesaId);
    if (mesa === undefined) throw new ValidacionError('mesaId es obligatorio');

    return this.pedidos
      .listar()
      .filter((p) => p.mesaId === mesa && ESTADOS_ACTIVOS.includes(p.estado))
      .map((p) => this.conTotal(p));
  }

  obtener(id: number): PedidoConTotal {
    const pedido = this.pedidos.buscarPorId(id);
    if (!pedido) throw new NoEncontradoError(`Pedido ${id} no encontrado`);
    return this.conTotal(pedido);
  }
}
