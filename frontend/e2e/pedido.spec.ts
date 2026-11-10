import { expect, test, type Page } from '@playwright/test';
import { URL_API_E2E } from './entorno';

// Antes de cada test la API vuelve a empezar sin pedidos: los E2E no dependen unos de otros.
test.beforeEach(async ({ request }) => {
  const respuesta = await request.post(`${URL_API_E2E}/__test__/reset`);
  expect(respuesta.status()).toBe(204);
});

async function agregarExpresoMedianoColombia(page: Page) {
  await page.getByRole('radio', { name: 'Expreso' }).check();
  await page.getByRole('radio', { name: 'Mediano' }).check();
  await expect(page.getByText('$7.360')).toBeVisible();
  await page.getByRole('radio', { name: 'Colombia' }).check();
  await page.getByRole('button', { name: 'Agregar al carrito' }).click();
}

test('recorrido feliz: elegir un cafe, agregarlo, confirmar y ver el pedido', async ({ page }) => {
  await page.goto('/?mesa=4');
  await expect(page.getByRole('heading', { name: 'Cafeteria Origen' })).toBeVisible();
  await expect(page.getByText('Mesa 4')).toBeVisible();

  await agregarExpresoMedianoColombia(page);
  await expect(page.getByText('Cantidad: 1')).toBeVisible();
  await expect(page.getByText('Subtotal: $7.360')).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();

  await expect(page.getByText('Pedido #1')).toBeVisible();
  await expect(page.getByText('Estado: pendiente')).toBeVisible();
  await expect(page.getByText('Total: $7.360')).toBeVisible();
});

test('seguir el pedido: actualizar el estado sin recargar la pagina', async ({ page, request }) => {
  await page.goto('/?mesa=4');
  await page.getByRole('button', { name: 'Agregar Muffin de chocolate' }).click();
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await expect(page.getByText('Estado: pendiente')).toBeVisible();

  // La cocina avanza el pedido: lo simulamos con el seed de la API
  const seed = await request.post(`${URL_API_E2E}/__test__/seed`, {
    data: { pedidos: [{ mesaId: 4, items: [{ productoId: 19, cantidad: 1 }], estado: 'en preparacion' }] },
  });
  expect(seed.status()).toBe(201);
  await page.getByRole('button', { name: 'Actualizar estado' }).click();

  await expect(page.getByText('Estado: en preparacion')).toBeVisible();
  await expect(page.getByText('Total: $2.500')).toBeVisible();
});

test('sin ?mesa el pedido se envia sin mesa, para retirar en la barra', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByText('Retiro en la barra')).toBeVisible();

  await page.getByRole('button', { name: 'Agregar Torta selva negra' }).click();
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await expect(page.getByText('Pedido #1')).toBeVisible();

  const pedido = await (await request.get(`${URL_API_E2E}/pedidos/1`)).json();
  expect(pedido).not.toHaveProperty('mesaId');
  expect(pedido.total).toBe(4200);
});

test.describe('celular de 375 px', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  async function verificarSinScrollHorizontal(page: Page) {
    const { ancho, visible } = await page.evaluate(() => ({
      ancho: document.documentElement.scrollWidth,
      visible: document.documentElement.clientWidth,
    }));
    expect(ancho).toBeLessThanOrEqual(visible);
  }

  test('no hay scroll horizontal en el menu, en el carrito ni en la confirmacion', async ({ page }) => {
    await page.goto('/?mesa=4');
    await expect(page.getByRole('radio', { name: 'Expreso' })).toBeVisible();
    await verificarSinScrollHorizontal(page);

    await agregarExpresoMedianoColombia(page);
    await page.getByRole('button', { name: 'Agregar Muffin de chocolate' }).click();
    await expect(page.getByText('Subtotal general: $9.860')).toBeVisible();
    await verificarSinScrollHorizontal(page);

    await page.getByRole('button', { name: 'Confirmar pedido' }).click();
    await expect(page.getByText('Pedido #1')).toBeVisible();
    await verificarSinScrollHorizontal(page);
  });
});
