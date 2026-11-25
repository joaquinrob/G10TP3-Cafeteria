import { z } from 'zod';
import { carritoVacio } from './carritoReducer';
import type { EstadoCarrito } from './tipos';

/** Lo minimo de localStorage que se usa: asi los tests pueden pasar un almacen en memoria. */
export type Almacen = Pick<Storage, 'getItem' | 'setItem'>;

const PREFIJO = 'origen.carrito';

/**
 * Lo guardado en el navegador puede estar viejo, roto o editado a mano:
 * se valida antes de usarlo, igual que las respuestas de la API.
 */
const esquemaCarritoGuardado: z.ZodType<EstadoCarrito> = z.object({
  items: z.array(
    z.object({
      productoId: z.number().int().positive(),
      nombre: z.string().min(1),
      precio: z.number().nonnegative(),
      cantidad: z.number().int().positive(),
    }),
  ),
});

/** Cada mesa tiene su propio carrito; sin mesa, el de retiro en la barra. */
export function claveCarrito(mesa: number | null): string {
  return mesa === null ? `${PREFIJO}.barra` : `${PREFIJO}.mesa-${mesa}`;
}

/** Devuelve el carrito guardado, o el vacio si no hay nada valido (o el navegador no deja leer). */
export function leerCarrito(almacen: Almacen, clave: string): EstadoCarrito {
  try {
    const texto = almacen.getItem(clave);
    if (texto === null) return carritoVacio;

    const resultado = esquemaCarritoGuardado.safeParse(JSON.parse(texto));
    return resultado.success ? resultado.data : carritoVacio;
  } catch {
    return carritoVacio;
  }
}

/** Guarda el carrito. Si el navegador no deja (modo privado, lleno), el carrito sigue andando en memoria. */
export function guardarCarrito(almacen: Almacen, clave: string, estado: EstadoCarrito): void {
  try {
    almacen.setItem(clave, JSON.stringify(estado));
  } catch {
    // Sin almacenamiento no hay persistencia, pero el pedido se puede hacer igual.
  }
}
