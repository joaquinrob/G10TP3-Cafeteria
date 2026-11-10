import { useId, type ReactNode } from 'react';

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
  const prefijo = useId();

  return (
    <fieldset className="mb-3">
      <legend className="h6">{titulo}</legend>
      {opciones.map(({ valor, etiqueta, detalle }) => {
        const id = `${prefijo}-${valor.replace(/\s+/g, '-')}`;
        return (
          <div key={valor} className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              id={id}
              name={nombre}
              value={valor}
              checked={elegida === valor}
              onChange={() => onElegir(valor)}
            />
            <label className="form-check-label" htmlFor={id}>
              {etiqueta}
            </label>
            {detalle}
          </div>
        );
      })}
    </fieldset>
  );
}
