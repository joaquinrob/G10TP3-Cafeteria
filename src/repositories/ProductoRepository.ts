import { Producto } from '../models/Producto';
import { crearCatalogo } from '../data/catalogo';

export class ProductoRepository {
  private productos: Producto[];

  constructor(productos: Producto[] = crearCatalogo()) {
    this.productos = productos;
  }

  listar(): Producto[] {
    return [...this.productos];
  }

  buscarPorId(id: number): Producto | undefined {
    return this.productos.find((p) => p.id === id);
  }
}
