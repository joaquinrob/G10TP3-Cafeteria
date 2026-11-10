import type { Producto, ProductoPasteleria } from '../api/contrato';
import { formatearPrecio } from '../utils/precio';

interface Props {
  productos: Producto[];
  onAgregar: (producto: ProductoPasteleria) => void;
}

export function Pasteleria({ productos, onAgregar }: Props) {
  const pasteleria = productos.filter((p): p is ProductoPasteleria => p.tipo === 'pasteleria');

  return (
    <section aria-labelledby="titulo-pasteleria" className="mb-4">
      <h2 id="titulo-pasteleria" className="h4">
        Pasteleria
      </h2>
      <ul className="list-group">
        {pasteleria.map((producto) => (
          <li key={producto.id} className="list-group-item d-flex flex-wrap align-items-center gap-2">
            <span className="me-auto">{producto.nombre}</span>
            <span className="fw-bold">{formatearPrecio(producto.precio)}</span>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onAgregar(producto)}>
              Agregar {producto.nombre}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
