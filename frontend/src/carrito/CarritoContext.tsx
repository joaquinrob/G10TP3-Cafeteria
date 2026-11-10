import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { carritoReducer, carritoVacio } from './carritoReducer';
import { AccionCarrito, EstadoCarrito } from './tipos';

interface ValorCarrito {
  estado: EstadoCarrito;
  dispatch: Dispatch<AccionCarrito>;
}

const CarritoContext = createContext<ValorCarrito | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(carritoReducer, carritoVacio);
  return <CarritoContext.Provider value={{ estado, dispatch }}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): ValorCarrito {
  const valor = useContext(CarritoContext);
  if (!valor) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return valor;
}
