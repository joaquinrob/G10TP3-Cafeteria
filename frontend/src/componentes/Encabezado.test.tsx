import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Encabezado } from './Encabezado';

describe('Encabezado', () => {
  it('muestra el nombre de la cafeteria', () => {
    render(<Encabezado mesa={4} />);
    expect(screen.getByRole('heading', { name: 'Cafeteria Origen' })).toBeInTheDocument();
  });

  it('muestra la mesa del QR', () => {
    render(<Encabezado mesa={4} />);
    expect(screen.getByText('Mesa 4')).toBeInTheDocument();
  });

  it('sin mesa el pedido es para retirar en la barra', () => {
    render(<Encabezado mesa={null} />);
    expect(screen.getByText('Retiro en la barra')).toBeInTheDocument();
    expect(screen.queryByText(/Mesa/)).not.toBeInTheDocument();
  });
});
