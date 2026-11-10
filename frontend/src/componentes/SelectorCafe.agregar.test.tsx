import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { menuDeEjemplo } from '../test/menu';
import { SelectorCafe } from './SelectorCafe';

describe('SelectorCafe: agregar al carrito', () => {
  it('el boton esta deshabilitado hasta completar las tres elecciones', async () => {
    const usuario = userEvent.setup();
    render(<SelectorCafe productos={menuDeEjemplo} onAgregar={() => {}} />);
    const boton = screen.getByRole('button', { name: 'Agregar al carrito' });
    expect(boton).toBeDisabled();

    await usuario.click(screen.getByRole('radio', { name: 'Expreso' }));
    expect(boton).toBeDisabled();

    await usuario.click(screen.getByRole('radio', { name: 'Mediano' }));
    expect(boton).toBeDisabled();

    await usuario.click(screen.getByRole('radio', { name: 'Colombia' }));
    expect(boton).toBeEnabled();
  });

  it('al agregar entrega el cafe elegido', async () => {
    const usuario = userEvent.setup();
    const onAgregar = vi.fn();
    render(<SelectorCafe productos={menuDeEjemplo} onAgregar={onAgregar} />);

    await usuario.click(screen.getByRole('radio', { name: 'Expreso' }));
    await usuario.click(screen.getByRole('radio', { name: 'Mediano' }));
    await usuario.click(screen.getByRole('radio', { name: 'Colombia' }));
    await usuario.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(expect.objectContaining({ id: 5, precio: 7360 }));
  });

  it('si la combinacion no existe en el menu el boton sigue deshabilitado', async () => {
    const usuario = userEvent.setup();
    render(<SelectorCafe productos={menuDeEjemplo} onAgregar={() => {}} />);

    await usuario.click(screen.getByRole('radio', { name: 'Filtrado' }));
    await usuario.click(screen.getByRole('radio', { name: 'Taza grande' }));
    await usuario.click(screen.getByRole('radio', { name: 'Colombia' }));

    expect(screen.getByRole('button', { name: 'Agregar al carrito' })).toBeDisabled();
  });
});
