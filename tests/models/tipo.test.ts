import { describe, it, expect } from 'vitest';
import { Expreso } from '../../src/models/Expreso';
import { Filtrado } from '../../src/models/Filtrado';
import { Pasteleria } from '../../src/models/Pasteleria';

describe('tipo de producto', () => {
  it('Expreso es de tipo expreso', () => {
    expect(new Expreso(1, 'Pocillo', 'Brasil').tipo).toBe('expreso');
  });

  it('Filtrado es de tipo filtrado', () => {
    expect(new Filtrado(10, 'Pocillo', 'Brasil').tipo).toBe('filtrado');
  });

  it('Pasteleria es de tipo pasteleria', () => {
    expect(new Pasteleria(19, 'Muffin de chocolate', 2500).tipo).toBe('pasteleria');
  });
});
