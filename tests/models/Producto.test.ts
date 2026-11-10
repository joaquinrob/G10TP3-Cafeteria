import { describe, it, expect } from 'vitest';
import { Producto } from '../../src/models/Producto';
import { Expreso } from '../../src/models/Expreso';
import { Filtrado } from '../../src/models/Filtrado';
import { Pasteleria } from '../../src/models/Pasteleria';

describe('Polimorfismo de Producto', () => {
  it('cada subclase calcula su precio a su manera con el mismo metodo', () => {
    const productos: Producto[] = [
      new Expreso(1, 'Pocillo', 'Brasil'),
      new Filtrado(2, 'Pocillo', 'Brasil'),
      new Pasteleria(3, 'Muffin de chocolate', 2500),
    ];
    expect(productos.map((p) => p.calcularPrecio())).toEqual([5020, 4040, 2500]);
  });

  it('todas las subclases son instancias de Producto', () => {
    expect(new Expreso(1, 'Pocillo', 'Brasil')).toBeInstanceOf(Producto);
    expect(new Filtrado(2, 'Pocillo', 'Brasil')).toBeInstanceOf(Producto);
    expect(new Pasteleria(3, 'Muffin', 2500)).toBeInstanceOf(Producto);
  });
});
