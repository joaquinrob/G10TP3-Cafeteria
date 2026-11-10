import { useState } from 'react';
import type { Producto, ProductoCafe } from '../api/contrato';
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
  onAgregar: (cafe: ProductoCafe) => void;
}

export function SelectorCafe({ productos, onAgregar }: Props) {
  const [eleccion, setEleccion] = useState<Partial<EleccionCafe>>({});

  const descripcionDe = (origen: Origen) =>
    productos.filter(esCafe).find((cafe) => cafe.variedad.nombre === origen)?.variedad.descripcion;

  const precioDe = (origen: Origen): number | undefined => {
    const { bebida, tamanio } = eleccion;
    if (!bebida || !tamanio) return undefined;
    return buscarCafe(productos, { bebida, tamanio, origen })?.precio;
  };

  const { bebida, tamanio, origen } = eleccion;
  const cafeElegido = bebida && tamanio && origen ? buscarCafe(productos, { bebida, tamanio, origen }) : undefined;

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
        {TAMANIOS.map((valor) => (
          <label key={valor}>
            <input
              type="radio"
              name="tamanio"
              value={valor}
              checked={eleccion.tamanio === valor}
              onChange={() => setEleccion({ ...eleccion, tamanio: valor })}
            />{' '}
            {valor}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Origen</legend>
        {ORIGENES.map((valor) => {
          const precio = precioDe(valor);
          return (
            <div key={valor}>
              <label>
                <input
                  type="radio"
                  name="origen"
                  value={valor}
                  checked={eleccion.origen === valor}
                  onChange={() => setEleccion({ ...eleccion, origen: valor })}
                  aria-describedby={`descripcion-${valor}`}
                />{' '}
                {valor}
              </label>
              <p id={`descripcion-${valor}`}>{descripcionDe(valor)}</p>
              {precio !== undefined && <p>{formatearPrecio(precio)}</p>}
            </div>
          );
        })}
      </fieldset>

      <button type="button" disabled={!cafeElegido} onClick={() => cafeElegido && onAgregar(cafeElegido)}>
        Agregar al carrito
      </button>
    </section>
  );
}
