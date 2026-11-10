import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { menuDeEjemplo } from '../test/menu';
import { Pasteleria } from './Pasteleria';

describe('Pasteleria', () => {
  it('muestra el muffin y la torta, cada uno con su precio', () => {
    render(<Pasteleria productos={menuDeEjemplo} onAgregar={() => {}} />);

    expect(screen.getByText('Muffin de chocolate')).toBeInTheDocument();
    expect(screen.getByText('$2.500')).toBeInTheDocument();
    expect(screen.getByText('Torta selva negra')).toBeInTheDocument();
    expect(screen.getByText('$4.200')).toBeInTheDocument();
  });

  it('no muestra los cafes', () => {
    render(<Pasteleria productos={menuDeEjemplo} onAgregar={() => {}} />);

    expect(screen.queryByText(/Expreso/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Filtrado/)).not.toBeInTheDocument();
  });

  it('cada producto tiene su boton para agregarlo', async () => {
    const usuario = userEvent.setup();
    const onAgregar = vi.fn();
    render(<Pasteleria productos={menuDeEjemplo} onAgregar={onAgregar} />);

    await usuario.click(screen.getByRole('button', { name: 'Agregar Torta selva negra' }));

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(expect.objectContaining({ id: 20, precio: 4200 }));
  });
});
