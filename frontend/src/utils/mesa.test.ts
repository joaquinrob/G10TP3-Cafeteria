import { describe, it, expect } from 'vitest';
import { leerMesa } from './mesa';

describe('leerMesa', () => {
  it('lee la mesa de ?mesa=N', () => {
    expect(leerMesa('?mesa=4')).toBe(4);
  });

  it('lee la mesa aunque haya otros parametros', () => {
    expect(leerMesa('?origen=qr&mesa=12')).toBe(12);
  });

  it('devuelve null si no hay parametro mesa (retiro en la barra)', () => {
    expect(leerMesa('')).toBeNull();
    expect(leerMesa('?otro=1')).toBeNull();
  });

  it.each([['?mesa='], ['?mesa=abc'], ['?mesa=0'], ['?mesa=-2'], ['?mesa=2.5'], ['?mesa=4abc']])(
    'devuelve null si la mesa es invalida (%s)',
    (search) => {
      expect(leerMesa(search)).toBeNull();
    },
  );
});
