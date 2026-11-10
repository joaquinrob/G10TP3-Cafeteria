import { z } from 'zod';

const variedadSchema = z.object({
  nombre: z.enum(['Brasil', 'Colombia', 'Etiopia']),
  descripcion: z.string(),
});

const cafeSchema = z.object({
  id: z.number().int(),
  tipo: z.enum(['expreso', 'filtrado']),
  nombre: z.string(),
  precioBase: z.number(),
  tamanio: z.enum(['Pocillo', 'Mediano', 'Taza grande']),
  gramosCafe: z.number(),
  variedad: variedadSchema,
  precio: z.number(),
});

const pasteleriaSchema = z.object({
  id: z.number().int(),
  tipo: z.literal('pasteleria'),
  nombre: z.string(),
  precioBase: z.number(),
  precio: z.number(),
});

export const productoSchema = z.discriminatedUnion('tipo', [cafeSchema, pasteleriaSchema]);
export const productosSchema = z.array(productoSchema);

export type Producto = z.infer<typeof productoSchema>;

export const pedidoSchema = z.object({
  id: z.number().int(),
  mesaId: z.number().int().optional(),
  items: z.array(
    z.object({
      productoId: z.number().int(),
      cantidad: z.number().int(),
    }),
  ),
  estado: z.enum(['pendiente', 'en preparacion', 'entregado']),
  total: z.number(),
});

export const errorApiSchema = z.object({ error: z.string() });

export type Pedido = z.infer<typeof pedidoSchema>;
export type ErrorApiRespuesta = z.infer<typeof errorApiSchema>;
