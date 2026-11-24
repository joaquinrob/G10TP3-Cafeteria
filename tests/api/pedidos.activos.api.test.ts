import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

const items = [{ productoId: 19, cantidad: 1 }];

describe('API GET /pedidos/activos?mesaId=N', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  const crear = (body: object) => request(app).post('/pedidos').send(body);

  it('200 con lista vacia si la mesa no tiene pedidos', async () => {
    const res = await request(app).get('/pedidos/activos?mesaId=4');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('devuelve los pedidos pendientes y en preparacion de la mesa', async () => {
    await crear({ mesaId: 4, items });
    await crear({ mesaId: 4, items, estado: 'en preparacion' });

    const res = await request(app).get('/pedidos/activos?mesaId=4');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, mesaId: 4, items, estado: 'pendiente', total: 2500 },
      { id: 2, mesaId: 4, items, estado: 'en preparacion', total: 2500 },
    ]);
  });

  it('deja afuera los entregados, los de otras mesas y los de la barra', async () => {
    await crear({ mesaId: 4, items, estado: 'entregado' });
    await crear({ mesaId: 5, items });
    await crear({ items });
    await crear({ mesaId: 4, items });

    const res = await request(app).get('/pedidos/activos?mesaId=4');
    expect(res.body.map((p: { id: number }) => p.id)).toEqual([4]);
  });

  it('no se confunde con GET /pedidos/:id', async () => {
    const res = await request(app).get('/pedidos/activos?mesaId=4');
    expect(res.status).not.toBe(400);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('400 si falta mesaId', async () => {
    const res = await request(app).get('/pedidos/activos');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'mesaId es obligatorio' });
  });

  it.each([['abc'], ['0'], ['-1'], ['1.5'], ['4abc'], ['']])('400 con mesaId invalido: "%s"', async (mesaId) => {
    const res = await request(app).get('/pedidos/activos').query({ mesaId });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/mesaId/);
  });

  it('400 si mesaId viene repetido', async () => {
    const res = await request(app).get('/pedidos/activos?mesaId=1&mesaId=2');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/mesaId/);
  });
});