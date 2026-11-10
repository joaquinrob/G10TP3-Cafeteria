import type { Producto } from '../api/contrato';
import { esCafe, type Bebida, type Origen, type Tamanio } from '../menu/cafe';

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
  const descripcionDe = (origen: Origen) =>
    productos.filter(esCafe).find((cafe) => cafe.variedad.nombre === origen)?.variedad.descripcion;

  return (
    <section aria-labelledby="titulo-cafe">
      <h2 id="titulo-cafe">Cafe</h2>

      <fieldset>
        <legend>Bebida</legend>
        {BEBIDAS.map(({ valor, etiqueta }) => (
          <label key={valor}>
            <input type="radio" name="bebida" value={valor} /> {etiqueta}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Tamanio</legend>
        {TAMANIOS.map((tamanio) => (
          <label key={tamanio}>
            <input type="radio" name="tamanio" value={tamanio} /> {tamanio}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Origen</legend>
        {ORIGENES.map((origen) => (
          <div key={origen}>
            <label>
              <input type="radio" name="origen" value={origen} aria-describedby={`descripcion-${origen}`} /> {origen}
            </label>
            <p id={`descripcion-${origen}`}>{descripcionDe(origen)}</p>
          </div>
        ))}
      </fieldset>
    </section>
  );
}
