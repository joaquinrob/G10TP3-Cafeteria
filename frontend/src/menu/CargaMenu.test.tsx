import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/servidor';
import { expresoMedianoColombia, muffin } from '../test/fixtures';
import { URL_API } from '../api/cliente';
import { CargaMenu } from './CargaMenu';

const urlProductos = `${URL_API}/productos`;

function mostrarMenu() {
  render(
    <CargaMenu>
      {(productos) => (
        <ul>
          {productos.map((p) => (
            <li key={p.id}>{p.nombre}</li>
          ))}
        </ul>
      )}
    </CargaMenu>,
  );
}

describe('CargaMenu', () => {
  it('muestra un indicador mientras carga y despues los productos', async () => {
    server.use(http.get(urlProductos, () => HttpResponse.json([expresoMedianoColombia, muffin])));

    mostrarMenu();

    expect(screen.getByRole('status', { name: 'Cargando el menu' })).toBeInTheDocument();
    expect(await screen.findByText('Muffin de chocolate')).toBeInTheDocument();
    expect(screen.getByText('Expreso Mediano Colombia')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('si la API falla muestra el mensaje y un boton para reintentar', async () => {
    server.use(
      http.get(urlProductos, () => HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 })),
    );

    mostrarMenu();

    expect(await screen.findByRole('alert')).toHaveTextContent('Error interno del servidor');
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('al reintentar vuelve a pedir el menu y lo muestra', async () => {
    const usuario = userEvent.setup();
    let fallar = true;
    server.use(
      http.get(urlProductos, () =>
        fallar
          ? HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
          : HttpResponse.json([muffin]),
      ),
    );
    mostrarMenu();
    await screen.findByRole('alert');

    fallar = false;
    await usuario.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByText('Muffin de chocolate')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('si la API esta caida muestra un mensaje de conexion', async () => {
    server.use(http.get(urlProductos, () => HttpResponse.error()));

    mostrarMenu();

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con la cafeteria');
  });

  it('si la respuesta no cumple el contrato muestra un error y no los productos', async () => {
    server.use(http.get(urlProductos, () => HttpResponse.json([{ ...muffin, precio: '2500' }])));

    mostrarMenu();

    expect(await screen.findByRole('alert')).toHaveTextContent('no tiene el formato esperado');
    expect(screen.queryByText('Muffin de chocolate')).not.toBeInTheDocument();
  });
});
