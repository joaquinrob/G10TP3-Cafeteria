import { describe, it, expect } from 'vitest';
import { Expreso } from '../../src/models/Expreso';
import type { Tamano, Variedad } from '../../src/models/tipos';

// Tabla del enunciado: [tamano, variedad, precio final]
const tabla: [Tamano, Variedad, number][] = [
  ['Pocillo', 'Brasil', 5020],
  ['Pocillo', 'Colombia', 5740],
  ['Pocillo', 'Etiopia', 6820],
  ['Mediano', 'Brasil', 6280],
  ['Mediano', 'Colombia', 7360],
  ['Mediano', 'Etiopia', 8980],
  ['Taza grande', 'Brasil', 7540],
  ['Taza grande', 'Colombia', 8980],
  ['Taza grande', 'Etiopia', 11140],
];

describe('Expreso', () => {
  it.each(tabla)('%s %s cuesta %i', (tamano, variedad, esperado) => {
    expect(new Expreso(1, tamano, variedad).calcularPrecio()).toBe(esperado);
  });

  it('tiene id, nombre y precioBase de 2500', () => {
    const e = new Expreso(7, 'Mediano', 'Etiopia');
    expect(e.id).toBe(7);
    expect(e.nombre).toBe('Expreso Mediano Etiopia');
    expect(e.precioBase).toBe(2500);
  });
});
