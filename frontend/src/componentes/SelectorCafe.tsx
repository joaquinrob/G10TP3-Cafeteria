import { useState } from 'react';
import type { Producto } from '../api/contrato';
import { buscarCafe, esCafe, type Bebida, type EleccionCafe, type Origen, type Tamanio } from '../menu/cafe';
import { formatearPrecio } from '../utils/precio';

const BEBIDAS: { valor: Bebida; etiqueta: string }[] = [
  { valor: 'expreso', etiqueta: 'Expreso' },
  { valor: 'filtrado', etiqueta: 'Filtrado' },
];
const TAMANIOS: Tamanio[] = ['Pocillo', 'Mediano', 'Taza grande'];
const ORIGENES: Origen[] = ['Colombia', 'Etiopia', 'Brasil'];

interface Props {
  productos: Producto[];
  onAgregar: (cafe: Producto) => void;
}

export function SelectorCafe({ productos }: Props) {
  const [eleccion, setEleccion] = useState<Partial<EleccionCafe>>({});

  const descripcionDe = (origen: Origen) =>
    productos.filter(esCafe).find((cafe) => cafe.variedad.nombre === origen)?.variedad.descripcion;

  const precioDe = (origen: Origen): number | undefined => {
    const { bebida, tamanio } = eleccion;
    if (!bebida || !tamanio) return undefined;
    return buscarCafe(productos, { bebida, tamanio, origen })?.precio;
  };

  return (
    <section aria-labelledby="titulo-cafe">
      <h2 id="titulo-cafe">Cafe</h2>

      <fieldset>
        <legend>Bebida</legend>
        {BEBIDAS.map(({ valor, etiqueta }) => (
          <label key={valor}>
            <input
              type="radio"
              name="bebida"
              value={valor}
              checked={eleccion.bebida === valor}
              onChange={() => setEleccion({ ...eleccion, bebida: valor })}
            />{' '}
            {etiqueta}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Tamanio</legend>
        {TAMANIOS.map((tamanio) => (
          <label key={tamanio}>
            <input
              type="radio"
              name="tamanio"
              value={tamanio}
              checked={eleccion.tamanio === tamanio}
              onChange={() => setEleccion({ ...eleccion, tamanio })}
            />{' '}
            {tamanio}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Origen</legend>
        {ORIGENES.map((origen) => {
          const precio = precioDe(origen);
          return (
            <div key={origen}>
              <label>
                <input
                  type="radio"
                  name="origen"
                  value={origen}
                  checked={eleccion.origen === origen}
                  onChange={() => setEleccion({ ...eleccion, origen })}
                  aria-describedby={`descripcion-${origen}`}
                />{' '}
                {origen}
              </label>
              <p id={`descripcion-${origen}`}>{descripcionDe(origen)}</p>
              {precio !== undefined && <p>{formatearPrecio(precio)}</p>}
            </div>
          );
        })}
      </fieldset>
    </section>
  );
}
