import type { Producto, ProductoPasteleria } from '../api/contrato';
import { formatearPrecio } from '../utils/precio';

interface Props {
  productos: Producto[];
  onAgregar: (producto: ProductoPasteleria) => void;
}

export function Pasteleria({ productos, onAgregar }: Props) {
  const pasteleria = productos.filter((p): p is ProductoPasteleria => p.tipo === 'pasteleria');

  return (
    <section aria-labelledby="titulo-pasteleria">
      <h2 id="titulo-pasteleria">Pasteleria</h2>
      <ul>
        {pasteleria.map((producto) => (
          <li key={producto.id}>
            <span>{producto.nombre}</span> <span>{formatearPrecio(producto.precio)}</span>{' '}
            <button type="button" onClick={() => onAgregar(producto)}>
              Agregar {producto.nombre}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
