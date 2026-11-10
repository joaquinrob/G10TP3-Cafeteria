import { Producto } from '../models/Producto';
import { Cafe } from '../models/Cafe';
import { TipoProducto } from '../models/tipos';
import { DESCRIPCION_VARIEDAD } from '../config/variedades';

interface ProductoBaseDTO {
  id: number;
  nombre: string;
  precioBase: number;
  precio: number;
}

export interface CafeDTO extends ProductoBaseDTO {
  tipo: 'expreso' | 'filtrado';
  tamanio: string;
  gramosCafe: number;
  variedad: { nombre: string; descripcion: string };
}

export interface PasteleriaDTO extends ProductoBaseDTO {
  tipo: 'pasteleria';
}

export type ProductoDTO = CafeDTO | PasteleriaDTO;

/** Convierte un producto del dominio al formato que devuelve la API. */
export function aProductoDTO(p: Producto): ProductoDTO {
  const base = { id: p.id, nombre: p.nombre, precioBase: p.precioBase, precio: p.calcularPrecio() };
  if (p instanceof Cafe) {
    return {
      ...base,
      tipo: p.tipo as Exclude<TipoProducto, 'pasteleria'>,
      tamanio: p.tamano,
      gramosCafe: p.gramos,
      variedad: { nombre: p.variedad, descripcion: DESCRIPCION_VARIEDAD[p.variedad] },
    };
  }
  return { ...base, tipo: 'pasteleria' };
}
