import { productosSchema } from '../api/contrato';

const descripciones = {
  Colombia: 'Acidez media, cuerpo equilibrado y notas citricas y florales',
  Etiopia: 'Acidez muy viva, cuerpo ligero y notas frutales',
  Brasil: 'Acidez baja, cuerpo denso y notas de avellana',
} as const;

function cafe(
  id: number,
  tipo: 'expreso' | 'filtrado',
  tamanio: 'Pocillo' | 'Mediano' | 'Taza grande',
  gramosCafe: number,
  origen: keyof typeof descripciones,
  precio: number,
) {
  const base = tipo === 'expreso' ? 2500 : 3200;
  const nombre = `${tipo === 'expreso' ? 'Expreso' : 'Filtrado'} ${tamanio} ${origen}`;
  return {
    id,
    tipo,
    nombre,
    precioBase: base,
    tamanio,
    gramosCafe,
    variedad: { nombre: origen, descripcion: descripciones[origen] },
    precio,
  };
}

/** Un menu de ejemplo con el mismo formato que devuelve la API (un subconjunto de los 20 productos). */
export const menuDeEjemplo = productosSchema.parse([
  cafe(1, 'expreso', 'Pocillo', 18, 'Brasil', 5020),
  cafe(2, 'expreso', 'Pocillo', 18, 'Colombia', 5740),
  cafe(3, 'expreso', 'Pocillo', 18, 'Etiopia', 6820),
  cafe(4, 'expreso', 'Mediano', 27, 'Brasil', 6280),
  cafe(5, 'expreso', 'Mediano', 27, 'Colombia', 7360),
  cafe(6, 'expreso', 'Mediano', 27, 'Etiopia', 8980),
  cafe(13, 'filtrado', 'Mediano', 15, 'Brasil', 5300),
  cafe(14, 'filtrado', 'Mediano', 15, 'Colombia', 5900),
  cafe(15, 'filtrado', 'Mediano', 15, 'Etiopia', 6800),
  { id: 19, tipo: 'pasteleria', nombre: 'Muffin de chocolate', precioBase: 2500, precio: 2500 },
  { id: 20, tipo: 'pasteleria', nombre: 'Torta selva negra', precioBase: 4200, precio: 4200 },
]);
