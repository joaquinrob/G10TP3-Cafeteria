import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

describe('API /pedidos', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  describe('POST /pedidos', () => {
    it('crea el pedido y devuelve el total calculado', async () => {
      const res = await request(app)
        .post('/pedidos')
        .send({ items: [{ productoId: 1, cantidad: 2 }, { productoId: 19, cantidad: 1 }] });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: 1,
        items: [{ productoId: 1, cantidad: 2 }, { productoId: 19, cantidad: 1 }],
        estado: 'pendiente',
        total: 12540,
      });
    });
    it('400 con body invalido', async () => {
      const res = await request(app).post('/pedidos').send({ items: [] });
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
    it('404 si algun producto no existe', async () => {
      const res = await request(app).post('/pedidos').send({ items: [{ productoId: 999, cantidad: 1 }] });
      expect(res.status).toBe(404);
    });
    it('400 con JSON malformado', async () => {
      const res = await request(app)
        .post('/pedidos')
        .set('Content-Type', 'application/json')
        .send('{ no es json');
      expect(res.status).toBe(400);
    });
  });

  describe('GET /pedidos y GET /pedidos/:id', () => {
    it('lista vacia al inicio', async () => {
      const res = await request(app).get('/pedidos');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
    it('lista los pedidos creados y permite buscarlos por id', async () => {
      await request(app).post('/pedidos').send({ items: [{ productoId: 20, cantidad: 1 }] });
      await request(app).post('/pedidos').send({ items: [{ productoId: 19, cantidad: 2 }] });

      const lista = await request(app).get('/pedidos');
      expect(lista.body).toHaveLength(2);

      const uno = await request(app).get('/pedidos/2');
      expect(uno.status).toBe(200);
      expect(uno.body.total).toBe(5000);
    });
    it('404 si el pedido no existe', async () => {
      expect((await request(app).get('/pedidos/42')).status).toBe(404);
    });
  });
});
