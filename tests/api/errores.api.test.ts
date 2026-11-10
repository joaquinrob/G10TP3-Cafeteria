import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

describe('formato de errores de la API', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  it('una ruta inexistente responde 404 con { error }', async () => {
    const res = await request(app).get('/ruta-que-no-existe');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Ruta no encontrada' });
  });

  it('un cuerpo demasiado grande responde 413 con { error }, no 500', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({ items: [], relleno: 'x'.repeat(200000) });
    expect(res.status).toBe(413);
    expect(typeof res.body.error).toBe('string');
  });
});
