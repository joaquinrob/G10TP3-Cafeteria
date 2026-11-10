import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { carritoReducer, carritoVacio } from './carritoReducer';
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
}

export function CarritoProvider({ children, estadoInicial = carritoVacio }: Props) {
  const [estado, dispatch] = useReducer(carritoReducer, estadoInicial);
  return <CarritoContext.Provider value={{ estado, dispatch }}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): ValorCarrito {
  const valor = useContext(CarritoContext);
  if (!valor) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return valor;
}
