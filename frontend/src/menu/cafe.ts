import type { Producto, ProductoCafe } from '../api/contrato';

export type Bebida = ProductoCafe['tipo'];
export type Tamanio = ProductoCafe['tamanio'];
export type Origen = ProductoCafe['variedad']['nombre'];

export interface EleccionCafe {
  bebida: Bebida;
  tamanio: Tamanio;
  origen: Origen;
}

/** Distingue un cafe (expreso o filtrado) de la pasteleria. */
export function esCafe(producto: Producto): producto is ProductoCafe {
  return producto.tipo !== 'pasteleria';
}

/** Busca el cafe que corresponde a la eleccion del cliente (bebida, tamanio y origen). */
export function buscarCafe(productos: Producto[], eleccion: EleccionCafe): ProductoCafe | undefined {
  return productos
    .filter(esCafe)
    .find(
      (cafe) =>
        cafe.tipo === eleccion.bebida &&
        cafe.tamanio === eleccion.tamanio &&
        cafe.variedad.nombre === eleccion.origen,
    );
}
