import { useState } from 'react';
import type { Producto, ProductoCafe } from '../api/contrato';
import { buscarCafe, esCafe, type Bebida, type EleccionCafe, type Origen, type Tamanio } from '../menu/cafe';
import { formatearPrecio } from '../utils/precio';
import { GrupoOpciones, type Opcion } from './GrupoOpciones';

const BEBIDAS: Opcion<Bebida>[] = [
  { valor: 'expreso', etiqueta: 'Expreso' },
  { valor: 'filtrado', etiqueta: 'Filtrado' },
];

const TAMANIOS: Opcion<Tamanio>[] = [
  { valor: 'Pocillo', etiqueta: 'Pocillo' },
  { valor: 'Mediano', etiqueta: 'Mediano' },
  { valor: 'Taza grande', etiqueta: 'Taza grande' },
];

const ORIGENES: Origen[] = ['Colombia', 'Etiopia', 'Brasil'];

interface Props {
  productos: Producto[];
  onAgregar: (cafe: ProductoCafe) => void;
}

export function SelectorCafe({ productos, onAgregar }: Props) {
  const [eleccion, setEleccion] = useState<Partial<EleccionCafe>>({});
  const { bebida, tamanio, origen } = eleccion;

  const descripcionDe = (valor: Origen) =>
    productos.filter(esCafe).find((cafe) => cafe.variedad.nombre === valor)?.variedad.descripcion;

  const precioDe = (valor: Origen): number | undefined =>
    bebida && tamanio ? buscarCafe(productos, { bebida, tamanio, origen: valor })?.precio : undefined;

  const opcionesDeOrigen: Opcion<Origen>[] = ORIGENES.map((valor) => {
    const precio = precioDe(valor);
    return {
      valor,
      etiqueta: valor,
      detalle: (
        <>
          <p className="small text-secondary mb-0">{descripcionDe(valor)}</p>
          {precio !== undefined && <p className="fw-bold mb-0">{formatearPrecio(precio)}</p>}
        </>
      ),
    };
  });

  const cafeElegido = bebida && tamanio && origen ? buscarCafe(productos, { bebida, tamanio, origen }) : undefined;

  return (
    <section aria-labelledby="titulo-cafe" className="mb-4">
      <h2 id="titulo-cafe" className="h4">
        Cafe
      </h2>

      <GrupoOpciones
        titulo="Bebida"
        nombre="bebida"
        opciones={BEBIDAS}
        elegida={bebida}
        onElegir={(valor) => setEleccion({ ...eleccion, bebida: valor })}
      />
      <GrupoOpciones
        titulo="Tamanio"
        nombre="tamanio"
        opciones={TAMANIOS}
        elegida={tamanio}
        onElegir={(valor) => setEleccion({ ...eleccion, tamanio: valor })}
      />
      <GrupoOpciones
        titulo="Origen"
        nombre="origen"
        opciones={opcionesDeOrigen}
        elegida={origen}
        onElegir={(valor) => setEleccion({ ...eleccion, origen: valor })}
      />

      <button
        type="button"
        className="btn btn-primary w-100"
        disabled={!cafeElegido}
        onClick={() => cafeElegido && onAgregar(cafeElegido)}
      >
        Agregar al carrito
      </button>
    </section>
  );
}
