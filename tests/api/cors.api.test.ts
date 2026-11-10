import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

const ORIGEN_FRONT = 'http://localhost:5173';

describe('CORS', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  it('las respuestas incluyen Access-Control-Allow-Origin', async () => {
    const res = await request(app).get('/productos').set('Origin', ORIGEN_FRONT);
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  it('responde el preflight de POST /pedidos con 204 y los metodos y headers permitidos', async () => {
    const res = await request(app)
      .options('/pedidos')
      .set('Origin', ORIGEN_FRONT)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type');
    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-methods']).toContain('POST');
    expect(res.headers['access-control-allow-headers']).toContain('Content-Type');
  });

  it('los errores tambien incluyen los headers de CORS, para que el front lea el mensaje', async () => {
    const res = await request(app).get('/productos/999').set('Origin', ORIGEN_FRONT);
    expect(res.status).toBe(404);
    expect(res.headers['access-control-allow-origin']).toBe('*');
    expect(res.body).toEqual({ error: 'Producto 999 no encontrado' });
  });
});
