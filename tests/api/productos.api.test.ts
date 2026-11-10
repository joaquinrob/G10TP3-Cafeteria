import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

describe('API /productos', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /productos', () => {
    it('lista los 20 productos con su precio', async () => {
      const res = await request(app).get('/productos');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(20);
      expect(res.body[0]).toEqual({
        id: 1,
        nombre: 'Expreso Pocillo Brasil',
        precioBase: 2500,
        precio: 5020,
      });
    });
  });

  describe('GET /productos/:id', () => {
    it('devuelve el producto pedido', async () => {
      const res = await request(app).get('/productos/20');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 20, nombre: 'Torta selva negra', precioBase: 4200, precio: 4200 });
    });
    it('404 si no existe', async () => {
      expect((await request(app).get('/productos/999')).status).toBe(404);
    });
    it('400 si el id no es numerico', async () => {
      expect((await request(app).get('/productos/abc')).status).toBe(400);
    });
  });
});
