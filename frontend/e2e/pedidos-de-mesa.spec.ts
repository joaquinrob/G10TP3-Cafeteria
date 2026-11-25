import { expect, test } from '@playwright/test';
import { URL_API_E2E } from './entorno';

test.beforeEach(async ({ request }) => {
  const respuesta = await request.post(`${URL_API_E2E}/__test__/reset`);
  expect(respuesta.status()).toBe(204);
});

test('hacer un segundo pedido no hace perder de vista el primero', async ({ page }) => {
  await page.goto('/?mesa=4');
  await page.getByRole('button', { name: 'Agregar Muffin de chocolate' }).click();
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await expect(page.getByText('Pedido #1')).toBeVisible();

  await page.getByRole('button', { name: 'Hacer otro pedido' }).click();
  await page.getByRole('button', { name: 'Agregar Torta selva negra' }).click();
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await expect(page.getByText('Pedido #2')).toBeVisible();

  const lista = page.getByRole('region', { name: 'Pedidos de tu mesa' });
  await expect(lista.getByRole('listitem')).toHaveCount(2);
  await expect(lista.getByText('#1')).toBeVisible();
  await expect(lista.getByText('#2')).toBeVisible();
});

test('cada mesa ve solo sus pedidos, y los pedidos entregados no aparecen', async ({ page, request }) => {
  const item = [{ productoId: 19, cantidad: 1 }];
  await request.post(`${URL_API_E2E}/__test__/seed`, {
    data: {
      pedidos: [
        { mesaId: 4, items: item, estado: 'en preparacion' },
        { mesaId: 5, items: item },
        { mesaId: 4, items: item, estado: 'entregado' },
        { items: item },
      ],
    },
  });

  await page.goto('/?mesa=4');

  const lista = page.getByRole('region', { name: 'Pedidos de tu mesa' });
  await expect(lista.getByRole('listitem')).toHaveCount(1);
  await expect(lista.getByText('#1')).toBeVisible();
  await expect(lista.getByText('en preparacion')).toBeVisible();
});

test('actualizar muestra el nuevo estado sin recargar la pagina', async ({ page, request }) => {
  const item = [{ productoId: 19, cantidad: 1 }];
  await request.post(`${URL_API_E2E}/__test__/seed`, { data: { pedidos: [{ mesaId: 4, items: item }] } });
  await page.goto('/?mesa=4');
  const lista = page.getByRole('region', { name: 'Pedidos de tu mesa' });
  await expect(lista.getByText('pendiente')).toBeVisible();

  await request.post(`${URL_API_E2E}/__test__/seed`, {
    data: { pedidos: [{ mesaId: 4, items: item, estado: 'en preparacion' }] },
  });
  await page.getByRole('button', { name: 'Actualizar pedidos' }).click();

  await expect(lista.getByText('en preparacion')).toBeVisible();
});

test('en la barra no aparece la lista de pedidos de mesa', async ({ page, request }) => {
  const item = [{ productoId: 19, cantidad: 1 }];
  await request.post(`${URL_API_E2E}/__test__/seed`, { data: { pedidos: [{ mesaId: 4, items: item }] } });

  await page.goto('/');
  await expect(page.getByText('Retiro en la barra')).toBeVisible();

  await expect(page.getByRole('region', { name: 'Pedidos de tu mesa' })).toHaveCount(0);
});