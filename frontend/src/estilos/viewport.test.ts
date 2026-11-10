// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('pensado para el celular', () => {
  it('index.html declara el viewport para que la pagina se adapte al ancho del celular', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8');
    expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');
  });

  it('la pagina esta en espanol', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8');
    expect(html).toContain('<html lang="es">');
  });
});
