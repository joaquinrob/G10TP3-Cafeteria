import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

const items = [{ productoId: 5, cantidad: 1 }];

describe('endpoints de apoyo para E2E (NODE_ENV=test)', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  it('POST /__test__/reset borra los pedidos y reinicia la numeracion', async () => {
    await request(app).post('/pedidos').send({ items });
    await request(app).post('/pedidos').send({ items });

    const reset = await request(app).post('/__test__/reset');
    expect(reset.status).toBe(204);

    expect((await request(app).get('/pedidos')).body).toEqual([]);
    const nuevo = await request(app).post('/pedidos').send({ items });
    expect(nuevo.body.id).toBe(1);
  });

  it('POST /__test__/seed deja siempre los mismos datos', async () => {
    const primera = await request(app).post('/__test__/seed');
    expect(primera.status).toBe(201);

    const esperado = [
      { id: 1, mesaId: 9, items: [{ productoId: 19, cantidad: 1 }], estado: 'entregado', total: 2500 },
    ];
    expect((await request(app).get('/pedidos')).body).toEqual(esperado);

    await request(app).post('/__test__/seed');
    expect((await request(app).get('/pedidos')).body).toEqual(esperado);
  });

  it('POST /__test__/seed acepta los pedidos que se quieren cargar', async () => {
    const res = await request(app)
      .post('/__test__/seed')
      .send({ pedidos: [{ mesaId: 3, items }] });
    expect(res.status).toBe(201);

    const lista = (await request(app).get('/pedidos')).body;
    expect(lista).toHaveLength(1);
    expect(lista[0].mesaId).toBe(3);
  });

  it('POST /__test__/seed con pedidos invalidos responde 400 con { error }', async () => {
    const res = await request(app).post('/__test__/seed').send({ pedidos: 'no es una lista' });
    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
  });
});

describe('fuera del entorno de test', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('los endpoints /__test__ no existen', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const app = createApp();

    const reset = await request(app).post('/__test__/reset');
    const seed = await request(app).post('/__test__/seed');

    expect(reset.status).toBe(404);
    expect(seed.status).toBe(404);
  });
});
