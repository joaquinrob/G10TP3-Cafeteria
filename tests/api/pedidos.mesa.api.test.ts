import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

const items = [
  { productoId: 5, cantidad: 2 },
  { productoId: 19, cantidad: 1 },
];

describe('API /pedidos con mesa', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  it('POST /pedidos con mesaId lo devuelve en el pedido (201)', async () => {
    const res = await request(app).post('/pedidos').send({ mesaId: 4, items });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, mesaId: 4, items, estado: 'pendiente', total: 17220 });
  });

  it('POST /pedidos sin mesaId funciona (retiro en la barra)', async () => {
    const res = await request(app).post('/pedidos').send({ items });
    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty('mesaId');
  });

  it('GET /pedidos/:id devuelve el pedido con mesa, estado, items y total', async () => {
    await request(app).post('/pedidos').send({ mesaId: 4, items });
    const res = await request(app).get('/pedidos/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, mesaId: 4, items, estado: 'pendiente', total: 17220 });
  });

  it('POST /pedidos con mesaId invalido responde 400 con { error }', async () => {
    const res = await request(app).post('/pedidos').send({ mesaId: 0, items });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'mesaId debe ser un entero mayor a 0' });
  });
});
