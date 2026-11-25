import { expect, test } from '@playwright/test';
import { URL_API_E2E } from './entorno';

// Antes de cada test la API vuelve a empezar sin pedidos. Cada test de Playwright
// abre un navegador limpio, asi que tambien arranca sin carrito guardado.
test.beforeEach(async ({ request }) => {
  const respuesta = await request.post(`${URL_API_E2E}/__test__/reset`);
  expect(respuesta.status()).toBe(204);
});

test('al recargar la pagina el carrito sigue ahi y se puede confirmar', async ({ page }) => {
  await page.goto('/?mesa=4');
  await page.getByRole('button', { name: 'Agregar Muffin de chocolate' }).click();
  await page.getByRole('button', { name: 'Agregar Muffin de chocolate' }).click();
  await expect(page.getByText('Cantidad: 2')).toBeVisible();

  await page.reload();

  await expect(page.getByText('Cantidad: 2')).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await expect(page.getByText('Pedido #1')).toBeVisible();
  await expect(page.getByText('Total: $5.000')).toBeVisible();

  // Confirmado el pedido, el carrito guardado se vacia
  await page.reload();
  await expect(page.getByText('Tu carrito esta vacio')).toBeVisible();
});

test('cada mesa tiene su propio carrito', async ({ page }) => {
  await page.goto('/?mesa=4');
  await page.getByRole('button', { name: 'Agregar Torta selva negra' }).click();
  await expect(page.getByText('Cantidad: 1')).toBeVisible();

  await page.goto('/?mesa=7');

  await expect(page.getByText('Mesa 7')).toBeVisible();
  await expect(page.getByText('Tu carrito esta vacio')).toBeVisible();
});
