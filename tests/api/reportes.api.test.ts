import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

describe('API /reportes', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /reportes', () => {
    beforeEach(async () => {
      await request(app).post('/pedidos').send({ items: [{ productoId: 1, cantidad: 2 }] }); // 10040
      await request(app).post('/pedidos').send({ items: [{ productoId: 19, cantidad: 3 }] }); // 7500
    });

    it('/facturacion devuelve cuanto se facturo', async () => {
      const res = await request(app).get('/reportes/facturacion');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ facturacionTotal: 17540 });
    });

    it('/mas-vendido devuelve el producto mas vendido', async () => {
      const res = await request(app).get('/reportes/mas-vendido');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ producto: 'Muffin de chocolate', cantidad: 3 });
    });

    it('/mas-vendido da 404 si no hay ventas', async () => {
      const vacia = createApp();
      expect((await request(vacia).get('/reportes/mas-vendido')).status).toBe(404);
    });
  });
});
