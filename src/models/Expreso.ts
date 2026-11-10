import { Cafe } from './Cafe';
import { Tamano, Variedad } from './tipos';
import { GRAMOS_EXPRESO, PRECIO_BASE_EXPRESO } from '../config/precios';

export class Expreso extends Cafe {
  constructor(id: number, tamano: Tamano, variedad: Variedad) {
    super(id, `Expreso ${tamano} ${variedad}`, PRECIO_BASE_EXPRESO, tamano, variedad, GRAMOS_EXPRESO[tamano]);
  }
}
