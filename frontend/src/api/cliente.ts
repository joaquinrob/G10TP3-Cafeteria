import { errorApiSchema, pedidoSchema, productosSchema, type Pedido, type Producto } from './contrato';
import { ErrorApi, ErrorContrato, ErrorRed } from './errores';

export const URL_API: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface NuevoPedido {
  mesaId: number | null;
  items: { productoId: number; cantidad: number }[];
}

export async function obtenerProductos(): Promise<Producto[]> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${URL_API}/productos`);
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

  const resultado = productosSchema.safeParse(cuerpo);
  if (!resultado.success) throw new ErrorContrato(resultado.error.message);
  return resultado.data;
}

export async function crearPedido(nuevo: NuevoPedido): Promise<Pedido> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${URL_API}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mesaId: nuevo.mesaId ?? undefined, items: nuevo.items }),
    });
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

  const resultado = pedidoSchema.safeParse(cuerpo);
  if (!resultado.success) throw new ErrorContrato(resultado.error.message);
  return resultado.data;
}
