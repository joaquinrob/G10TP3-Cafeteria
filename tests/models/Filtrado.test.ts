import { describe, it, expect } from 'vitest';
import { Filtrado } from '../../src/models/Filtrado';
import type { Tamano, Variedad } from '../../src/models/tipos';

// Tabla del enunciado: [tamano, variedad, precio final]
const tabla: [Tamano, Variedad, number][] = [
  ['Pocillo', 'Brasil', 4040],
  ['Pocillo', 'Colombia', 4280],
  ['Pocillo', 'Etiopia', 4640],
  ['Mediano', 'Brasil', 5300],
  ['Mediano', 'Colombia', 5900],
  ['Mediano', 'Etiopia', 6800],
  ['Taza grande', 'Brasil', 6700],
  ['Taza grande', 'Colombia', 7700],
  ['Taza grande', 'Etiopia', 9200],
];

describe('Filtrado', () => {
  it.each(tabla)('%s %s cuesta %i', (tamano, variedad, esperado) => {
    expect(new Filtrado(1, tamano, variedad).calcularPrecio()).toBe(esperado);
  });

  it('tiene id, nombre y precioBase de 3200', () => {
    const f = new Filtrado(12, 'Pocillo', 'Brasil');
    expect(f.id).toBe(12);
    expect(f.nombre).toBe('Filtrado Pocillo Brasil');
    expect(f.precioBase).toBe(3200);
  });
});
