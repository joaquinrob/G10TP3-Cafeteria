import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { menuDeEjemplo } from '../test/menu';
import { SelectorCafe } from './SelectorCafe';

function mostrarSelector() {
  render(<SelectorCafe productos={menuDeEjemplo} onAgregar={() => {}} />);
  return userEvent.setup();
}

describe('SelectorCafe: precio por origen', () => {
  it('sin bebida y tamanio elegidos no muestra precios', async () => {
    const usuario = mostrarSelector();
    expect(screen.queryByText('$7.360')).not.toBeInTheDocument();

    await usuario.click(screen.getByRole('radio', { name: 'Expreso' }));

    expect(screen.queryByText('$7.360')).not.toBeInTheDocument();
  });

  it('con bebida y tamanio elegidos cada origen muestra su precio', async () => {
    const usuario = mostrarSelector();

    await usuario.click(screen.getByRole('radio', { name: 'Expreso' }));
    await usuario.click(screen.getByRole('radio', { name: 'Mediano' }));

    expect(screen.getByText('$7.360')).toBeInTheDocument();
    expect(screen.getByText('$8.980')).toBeInTheDocument();
    expect(screen.getByText('$6.280')).toBeInTheDocument();
  });

  it('al cambiar el tamanio cambian los precios', async () => {
    const usuario = mostrarSelector();
    await usuario.click(screen.getByRole('radio', { name: 'Expreso' }));
    await usuario.click(screen.getByRole('radio', { name: 'Mediano' }));

    await usuario.click(screen.getByRole('radio', { name: 'Pocillo' }));

    expect(screen.getByText('$5.740')).toBeInTheDocument();
    expect(screen.queryByText('$7.360')).not.toBeInTheDocument();
  });

  it('al cambiar la bebida cambian los precios', async () => {
    const usuario = mostrarSelector();
    await usuario.click(screen.getByRole('radio', { name: 'Expreso' }));
    await usuario.click(screen.getByRole('radio', { name: 'Mediano' }));

    await usuario.click(screen.getByRole('radio', { name: 'Filtrado' }));

    expect(screen.getByText('$5.900')).toBeInTheDocument();
    expect(screen.queryByText('$7.360')).not.toBeInTheDocument();
  });

  it('el origen sigue marcado como elegido al elegirlo', async () => {
    const usuario = mostrarSelector();

    await usuario.click(screen.getByRole('radio', { name: 'Colombia' }));

    expect(screen.getByRole('radio', { name: 'Colombia' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Brasil' })).not.toBeChecked();
  });
});
