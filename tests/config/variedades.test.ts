import { describe, it, expect } from 'vitest';
import { DESCRIPCION_VARIEDAD } from '../../src/config/variedades';

describe('DESCRIPCION_VARIEDAD', () => {
  it('Colombia: acidez media, cuerpo equilibrado y notas citricas y florales', () => {
    expect(DESCRIPCION_VARIEDAD.Colombia).toBe('Acidez media, cuerpo equilibrado y notas citricas y florales');
  });

  it('Etiopia: acidez muy viva, cuerpo ligero y notas frutales', () => {
    expect(DESCRIPCION_VARIEDAD.Etiopia).toBe('Acidez muy viva, cuerpo ligero y notas frutales');
  });

  it('Brasil: acidez baja, cuerpo denso y notas de avellana', () => {
    expect(DESCRIPCION_VARIEDAD.Brasil).toBe('Acidez baja, cuerpo denso y notas de avellana');
  });
});
