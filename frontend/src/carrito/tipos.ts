export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
}

export interface ItemCarrito {
  productoId: number;
  nombre: string;
  /** Precio unitario que informo la API. El subtotal del carrito es solo orientativo. */
  precio: number;
  cantidad: number;
}

export interface EstadoCarrito {
  items: ItemCarrito[];
}

export type AccionCarrito =
  | { tipo: 'agregar'; producto: ProductoCarrito }
  | { tipo: 'sumar'; productoId: number }
  | { tipo: 'restar'; productoId: number }
  | { tipo: 'quitar'; productoId: number }
  | { tipo: 'vaciar' };
