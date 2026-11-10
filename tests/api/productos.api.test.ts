import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

describe('API /productos', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /productos', () => {
    it('lista los 20 productos con tipo y precio', async () => {
      const res = await request(app).get('/productos');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(20);
      expect(res.body[0]).toEqual({
        id: 1,
        tipo: 'expreso',
        nombre: 'Expreso Pocillo Brasil',
        precioBase: 2500,
        tamanio: 'Pocillo',
        gramosCafe: 18,
        variedad: {
          nombre: 'Brasil',
          descripcion: 'Acidez baja, cuerpo denso y notas de avellana',
        },
        precio: 5020,
      });
    });
  });

  describe('GET /productos/:id', () => {
    it('devuelve una pasteleria con tipo y precio', async () => {
      const res = await request(app).get('/productos/20');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 20,
        tipo: 'pasteleria',
        nombre: 'Torta selva negra',
        precioBase: 4200,
        precio: 4200,
      });
    });

    it('devuelve un expreso mediano de Colombia a $7360', async () => {
      const res = await request(app).get('/productos/5');
      expect(res.status).toBe(200);
      expect(res.body.tipo).toBe('expreso');
      expect(res.body.precio).toBe(7360);
      expect(res.body.variedad.nombre).toBe('Colombia');
    });

    it('404 si no existe', async () => {
      const res = await request(app).get('/productos/999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });

    it('400 si el id no es numerico', async () => {
      const res = await request(app).get('/productos/abc');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });
});
