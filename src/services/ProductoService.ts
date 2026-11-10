import { ProductoRepository } from '../repositories/ProductoRepository';
import { ProductoDTO, aProductoDTO } from '../dto/producto.dto';
import { NoEncontradoError } from './errors';

export class ProductoService {
  constructor(private repo: ProductoRepository) {}

  listar(): ProductoDTO[] {
    return this.repo.listar().map(aProductoDTO);
  }

  obtener(id: number): ProductoDTO {
    const producto = this.repo.buscarPorId(id);
    if (!producto) throw new NoEncontradoError(`Producto ${id} no encontrado`);
    return aProductoDTO(producto);
  }
}
