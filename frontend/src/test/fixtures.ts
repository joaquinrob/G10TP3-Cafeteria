/** Respuestas de ejemplo con el formato real de la API (las usan los tests). */
export const expresoMedianoColombia = {
  id: 5,
  tipo: 'expreso',
  nombre: 'Expreso Mediano Colombia',
  precioBase: 2500,
  tamanio: 'Mediano',
  gramosCafe: 27,
  variedad: {
    nombre: 'Colombia',
    descripcion: 'Acidez media, cuerpo equilibrado y notas citricas y florales',
  },
  precio: 7360,
};

export const muffin = {
  id: 19,
  tipo: 'pasteleria',
  nombre: 'Muffin de chocolate',
  precioBase: 2500,
  precio: 2500,
};

export const pedidoMesa4 = {
  id: 1,
  mesaId: 4,
  items: [
    { productoId: 5, cantidad: 2 },
    { productoId: 19, cantidad: 1 },
  ],
  estado: 'pendiente',
  total: 17220,
};
