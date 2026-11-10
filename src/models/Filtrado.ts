import { Cafe } from './Cafe';
import { Tamano, Variedad } from './tipos';
import { GRAMOS_FILTRADO, PRECIO_BASE_FILTRADO } from '../config/precios';

export class Filtrado extends Cafe {
  constructor(id: number, tamano: Tamano, variedad: Variedad) {
    super(id, `Filtrado ${tamano} ${variedad}`, PRECIO_BASE_FILTRADO, tamano, variedad, GRAMOS_FILTRADO[tamano]);
  }
}
