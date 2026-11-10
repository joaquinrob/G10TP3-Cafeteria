import { Producto } from './Producto';
import { Tamano, Variedad } from './tipos';
import { PRECIO_POR_GRAMO } from '../config/precios';

export abstract class Cafe extends Producto {
  constructor(
    id: number,
    nombre: string,
    precioBase: number,
    public readonly tamano: Tamano,
    public readonly variedad: Variedad,
    public readonly gramos: number,
  ) {
    super(id, nombre, precioBase);
  }

  /** Costo del cafe = gramos x precio por gramo de la variedad. */
  calcularCostoCafe(): number {
    return this.gramos * PRECIO_POR_GRAMO[this.variedad];
  }

  /** Precio final = precio base (super) + costo del cafe. */
  calcularPrecio(): number {
    return super.calcularPrecio() + this.calcularCostoCafe();
  }
}
