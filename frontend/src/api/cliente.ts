import type { z } from 'zod';
import { errorApiSchema, pedidoSchema, productosSchema, type Pedido, type Producto } from './contrato';
import { ErrorApi, ErrorContrato, ErrorRed } from './errores';

export const URL_API: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface NuevoPedido {
  mesaId: number | null;
  items: { productoId: number; cantidad: number }[];
}

/**
 * Unico lugar donde se hace fetch: llama a la API, traduce los errores
 * (red, API o contrato) y valida la respuesta con el esquema de Zod.
 */
async function solicitar<T>(ruta: string, esquema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${URL_API}${ruta}`, init);
  } catch {
    throw new ErrorRed();
  }

  const cuerpo: unknown = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const error = errorApiSchema.safeParse(cuerpo);
    throw new ErrorApi(
      respuesta.status,
      error.success ? error.data.error : `Error ${respuesta.status} del servidor`,
    );
  }

  const resultado = esquema.safeParse(cuerpo);
  if (!resultado.success) throw new ErrorContrato(resultado.error.message);
  return resultado.data;
}

export function obtenerProductos(): Promise<Producto[]> {
  return solicitar('/productos', productosSchema);
}

export function crearPedido(nuevo: NuevoPedido): Promise<Pedido> {
  return solicitar('/pedidos', pedidoSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mesaId: nuevo.mesaId ?? undefined, items: nuevo.items }),
  });
}
