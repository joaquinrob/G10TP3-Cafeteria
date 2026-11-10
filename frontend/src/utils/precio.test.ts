import { describe, it, expect } from 'vitest';
import { formatearPrecio } from './precio';

describe('formatearPrecio', () => {
  it.each([
    [0, '$0'],
    [999, '$999'],
    [1000, '$1.000'],
    [2500, '$2.500'],
    [7360, '$7.360'],
    [11140, '$11.140'],
    [1234567, '$1.234.567'],
  ])('%i se muestra como %s', (valor, esperado) => {
    expect(formatearPrecio(valor)).toBe(esperado);
  });

  it('redondea los centavos al peso mas cercano', () => {
    expect(formatearPrecio(2500.4)).toBe('$2.500');
    expect(formatearPrecio(2500.6)).toBe('$2.501');
  });
});
