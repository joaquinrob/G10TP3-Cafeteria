import type { ReactNode } from 'react';

export interface Opcion<T extends string> {
  valor: T;
  etiqueta: string;
  /** Texto extra bajo la opcion (por ejemplo, la descripcion del origen). */
  detalle?: ReactNode;
}

interface Props<T extends string> {
  titulo: string;
  nombre: string;
  opciones: Opcion<T>[];
  elegida: T | undefined;
  onElegir: (valor: T) => void;
}

/** Un paso de eleccion: un grupo de radios con su titulo, etiquetas y detalle opcional. */
export function GrupoOpciones<T extends string>({ titulo, nombre, opciones, elegida, onElegir }: Props<T>) {
  return (
    <fieldset>
      <legend>{titulo}</legend>
      {opciones.map(({ valor, etiqueta, detalle }) => (
        <div key={valor}>
          <label>
            <input
              type="radio"
              name={nombre}
              value={valor}
              checked={elegida === valor}
              onChange={() => onElegir(valor)}
            />{' '}
            {etiqueta}
          </label>
          {detalle}
        </div>
      ))}
    </fieldset>
  );
}
