import { describe, it, expect } from 'vitest';
import { leerMesa } from './mesa';

describe('leerMesa', () => {
  it('lee la mesa de ?mesa=N', () => {
    expect(leerMesa('?mesa=4')).toBe(4);
  });

  it('devuelve null si no hay parametro mesa (retiro en la barra)', () => {
    expect(leerMesa('')).toBeNull();
  });
});
