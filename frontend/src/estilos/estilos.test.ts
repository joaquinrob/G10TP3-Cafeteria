// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { compile } from 'sass';
import { resolve } from 'node:path';

function compilarEstilos(): string {
  return compile(resolve(process.cwd(), 'src/estilos/estilos.scss'), {
    loadPaths: [resolve(process.cwd(), 'node_modules')],
    quietDeps: true,
    silenceDeprecations: ['import'],
  }).css;
}

describe('estilos: Bootstrap con los colores de la cafeteria', () => {
  const css = compilarEstilos();

  it('el color primario es el marron del cafe, tanto en la variable como en los botones', () => {
    expect(css).toContain('--bs-primary: #6f4e37');
    expect(css).toMatch(/\.btn-primary\s*{[^}]*--bs-btn-bg:\s*#6f4e37/);
  });

  it('el fondo de la pagina es crema', () => {
    expect(css).toContain('--bs-body-bg: #f5ede3');
  });

  it('el texto principal es cafe oscuro', () => {
    expect(css).toContain('--bs-body-color: #3e2723');
  });

  it('los errores se muestran con el rojo de la cafeteria', () => {
    expect(css).toContain('--bs-danger: #b3261e');
  });
});
