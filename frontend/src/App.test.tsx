import { afterEach, beforeEach, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from './test/servidor';
import { menuDeEjemplo } from './test/menu';
import { pedidoMesa4 } from './test/fixtures';
import { URL_API } from './api/cliente';
import { App } from './App';

function abrirConQuery(query: string) {
  window.history.pushState({}, '', `/${query}`);
}

beforeEach(() => {
  server.use(http.get(`${URL_API}/productos`, () => HttpResponse.json(menuDeEjemplo)));
});

afterEach(() => {
  window.history.pushState({}, '', '/');
});

describe('App', () => {
  it('muestra el titulo de la cafeteria', async () => {
    abrirConQuery('');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Cafeteria Origen' })).toBeInTheDocument();
    await screen.findByRole('radio', { name: 'Expreso' });
  });

  it('con ?mesa=4 muestra la mesa en el encabezado', async () => {
    abrirConQuery('?mesa=4');
    render(<App />);

    expect(screen.getByText('Mesa 4')).toBeInTheDocument();
    await screen.findByRole('radio', { name: 'Expreso' });
  });

  it('sin ?mesa el pedido es para retirar en la barra', async () => {
    abrirConQuery('');
    render(<App />);

    expect(screen.getByText('Retiro en la barra')).toBeInTheDocument();
    await screen.findByRole('radio', { name: 'Expreso' });
  });

  it('con una mesa invalida el pedido es para retirar en la barra', async () => {
    abrirConQuery('?mesa=abc');
    render(<App />);

    expect(screen.getByText('Retiro en la barra')).toBeInTheDocument();
    await screen.findByRole('radio', { name: 'Expreso' });
  });

  it('mientras carga el menu muestra el indicador', async () => {
    abrirConQuery('?mesa=4');
    render(<App />);

    expect(screen.getByRole('status', { name: 'Cargando el menu' })).toBeInTheDocument();
    await screen.findByRole('radio', { name: 'Expreso' });
  });

  it('si la API esta caida muestra el error con un boton para reintentar', async () => {
    server.use(http.get(`${URL_API}/productos`, () => HttpResponse.error()));
    abrirConQuery('?mesa=4');
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con la cafeteria');
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('recorrido completo: elegir un cafe, agregarlo, confirmar y ver el pedido', async () => {
    const usuario = userEvent.setup();
    let cuerpoEnviado: unknown;
    server.use(
      http.post(`${URL_API}/pedidos`, async ({ request }) => {
        cuerpoEnviado = await request.json();
        return HttpResponse.json(
          { ...pedidoMesa4, items: [{ productoId: 5, cantidad: 1 }], total: 7360 },
          { status: 201 },
        );
      }),
    );
    abrirConQuery('?mesa=4');
    render(<App />);

    await usuario.click(await screen.findByRole('radio', { name: 'Expreso' }));
    await usuario.click(screen.getByRole('radio', { name: 'Mediano' }));
    expect(screen.getByText('$7.360')).toBeInTheDocument();
    await usuario.click(screen.getByRole('radio', { name: 'Colombia' }));
    await usuario.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByText('Pedido #1')).toBeInTheDocument();
    expect(screen.getByText('Estado: pendiente')).toBeInTheDocument();
    expect(screen.getByText('Total: $7.360')).toBeInTheDocument();
    expect(cuerpoEnviado).toEqual({ mesaId: 4, items: [{ productoId: 5, cantidad: 1 }] });
  });
});
