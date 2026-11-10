import { ProductoRepository } from '../repositories/ProductoRepository';
import { Producto } from '../models/Producto';
import { Cafe } from '../models/Cafe';
import { DESCRIPCION_VARIEDAD } from '../config/variedades';
import { NoEncontradoError } from './errors';

export interface ProductoDTO {
  id: number;
  tipo: string;
  nombre: string;
  precioBase: number;
  precio: number;
  tamanio?: string;
  gramosCafe?: number;
  variedad?: { nombre: string; descripcion: string };
}

export class ProductoService {
  constructor(private repo: ProductoRepository) {}

  static aDTO(p: Producto): ProductoDTO {
    const base = { id: p.id, tipo: p.tipo, nombre: p.nombre, precioBase: p.precioBase };
    if (p instanceof Cafe) {
      return {
        ...base,
        tamanio: p.tamano,
        gramosCafe: p.gramos,
        variedad: { nombre: p.variedad, descripcion: DESCRIPCION_VARIEDAD[p.variedad] },
        precio: p.calcularPrecio(),
      };
    }
    return { ...base, precio: p.calcularPrecio() };
  }

  listar(): ProductoDTO[] {
    return this.repo.listar().map(ProductoService.aDTO);
  }

  obtener(id: number): ProductoDTO {
    const producto = this.repo.buscarPorId(id);
    if (!producto) throw new NoEncontradoError(`Producto ${id} no encontrado`);
    return ProductoService.aDTO(producto);
  }
}
