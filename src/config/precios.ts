import { Tamano, Variedad } from '../models/tipos';

export const PRECIO_BASE_EXPRESO = 2500;
export const PRECIO_BASE_FILTRADO = 3200;

export const GRAMOS_EXPRESO: Record<Tamano, number> = { Pocillo: 18, Mediano: 27, 'Taza grande': 36 };
export const GRAMOS_FILTRADO: Record<Tamano, number> = { Pocillo: 6, Mediano: 15, 'Taza grande': 25 };

/** Precio por gramo de cafe segun la variedad ($). */
export const PRECIO_POR_GRAMO: Record<Variedad, number> = {
  Brasil: 140,
  Colombia: 180,
  Etiopia: 240,
};

export const PRECIO_MUFFIN = 2500;
export const PRECIO_TORTA = 4200;
