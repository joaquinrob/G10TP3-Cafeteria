import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

const items = [{ productoId: 5, cantidad: 1 }];

describe('errores de la API: siempre { error } y nunca 500', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  it('POST /pedidos sin cuerpo responde 400', async () => {
    const res = await request(app).post('/pedidos');
    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
  });

  it('JSON malformado responde 400', async () => {
    const res = await request(app)
      .post('/pedidos')
      .set('Content-Type', 'application/json')
      .send('{ no es json');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'JSON invalido' });
  });

  it.each([['abc'], [null], [-3], [2.5]])('mesaId invalido (%s) responde 400', async (mesaId) => {
    const res = await request(app).post('/pedidos').send({ mesaId, items });
    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
  });

  it('un producto inexistente en un pedido con mesa responde 404', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({ mesaId: 4, items: [{ productoId: 999, cantidad: 1 }] });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Producto 999 no encontrado' });
  });

  it('un pedido inexistente responde 404', async () => {
    const res = await request(app).get('/pedidos/42');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Pedido 42 no encontrado' });
  });

  it('un id de pedido no numerico responde 400', async () => {
    const res = await request(app).get('/pedidos/abc');
    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
  });
});
