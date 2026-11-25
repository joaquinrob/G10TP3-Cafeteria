import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { carritoReducer, carritoVacio } from './carritoReducer';
import { guardarCarrito, leerCarrito } from './persistencia';
import { AccionCarrito, EstadoCarrito } from './tipos';

interface ValorCarrito {
  estado: EstadoCarrito;
  dispatch: Dispatch<AccionCarrito>;
}

const CarritoContext = createContext<ValorCarrito | null>(null);

interface Props {
  children: ReactNode;
  /** Estado con el que arranca el carrito (por defecto, vacio). Util para los tests. */
  estadoInicial?: EstadoCarrito;
  /**
   * Clave de localStorage donde se recuerda el carrito. Si se pasa, el carrito arranca con lo
   * guardado y guarda cada cambio, asi el cliente no lo pierde al recargar la pagina.
   */
  claveAlmacenamiento?: string;
}

export function CarritoProvider({ children, estadoInicial = carritoVacio, claveAlmacenamiento }: Props) {
  const [estado, dispatch] = useReducer(carritoReducer, estadoInicial, (inicial) =>
    claveAlmacenamiento === undefined ? inicial : leerCarrito(localStorage, claveAlmacenamiento),
  );

  useEffect(() => {
    if (claveAlmacenamiento !== undefined) guardarCarrito(localStorage, claveAlmacenamiento, estado);
  }, [claveAlmacenamiento, estado]);

  return <CarritoContext.Provider value={{ estado, dispatch }}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): ValorCarrito {
  const valor = useContext(CarritoContext);
  if (!valor) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return valor;
}
