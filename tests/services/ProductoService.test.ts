import { describe, it, expect } from 'vitest';
import { ProductoRepository } from '../../src/repositories/ProductoRepository';
import { ProductoService } from '../../src/services/ProductoService';
import { NoEncontradoError } from '../../src/services/errors';

describe('ProductoService', () => {
  const service = new ProductoService(new ProductoRepository());

  it('listar devuelve los 20 productos', () => {
    expect(service.listar()).toHaveLength(20);
  });

  it('listar incluye el tipo de cada producto (9 expresos, 9 filtrados, 2 pastelerias)', () => {
    const tipos = service.listar().map((p) => p.tipo);
    expect(tipos.filter((t) => t === 'expreso')).toHaveLength(9);
    expect(tipos.filter((t) => t === 'filtrado')).toHaveLength(9);
    expect(tipos.filter((t) => t === 'pasteleria')).toHaveLength(2);
  });

  it('un expreso incluye tamanio, gramosCafe, variedad con descripcion y precio', () => {
    expect(service.obtener(5)).toEqual({
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
    });
  });

  it('un filtrado incluye tipo, tamanio, gramosCafe, variedad y precio', () => {
    expect(service.obtener(10)).toEqual({
      id: 10,
      tipo: 'filtrado',
      nombre: 'Filtrado Pocillo Brasil',
      precioBase: 3200,
      tamanio: 'Pocillo',
      gramosCafe: 6,
      variedad: {
        nombre: 'Brasil',
        descripcion: 'Acidez baja, cuerpo denso y notas de avellana',
      },
      precio: 4040,
    });
  });

  it('una pasteleria incluye tipo y precio, sin datos de cafe', () => {
    expect(service.obtener(20)).toEqual({
      id: 20,
      tipo: 'pasteleria',
      nombre: 'Torta selva negra',
      precioBase: 4200,
      precio: 4200,
    });
  });

  it('obtener lanza NoEncontradoError si no existe', () => {
    expect(() => service.obtener(999)).toThrow(NoEncontradoError);
  });
});
