import { describe, it, expect } from 'vitest';
import { Pasteleria } from '../../src/models/Pasteleria';

describe('Pasteleria', () => {
  it.each([
    ['Muffin de chocolate', 2500],
    ['Torta selva negra', 4200],
  ])('%s cuesta %i', (nombre, precio) => {
    expect(new Pasteleria(1, nombre, precio).calcularPrecio()).toBe(precio);
  });

  it('guarda id, nombre y precioBase', () => {
    const p = new Pasteleria(19, 'Muffin de chocolate', 2500);
    expect(p.id).toBe(19);
    expect(p.nombre).toBe('Muffin de chocolate');
    expect(p.precioBase).toBe(2500);
  });
});
