import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';
import { manejarErrores } from '../../src/middleware/manejarErrores';

function crearRespuesta() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { res: { status } as unknown as Response, status, json };
}

describe('manejarErrores', () => {
  it('un error inesperado responde 500 sin mostrar el detalle interno', () => {
    const { res, status, json } = crearRespuesta();
    manejarErrores(new Error('detalle secreto'), {} as Request, res, vi.fn());
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
  });
});
