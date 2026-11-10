import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { menuDeEjemplo } from '../test/menu';
import { SelectorCafe } from './SelectorCafe';

function mostrarSelector() {
  render(<SelectorCafe productos={menuDeEjemplo} onAgregar={() => {}} />);
}

describe('SelectorCafe: los tres pasos', () => {
  it('ofrece bebida, tamanio y origen', () => {
    mostrarSelector();

    const bebida = screen.getByRole('group', { name: 'Bebida' });
    expect(bebida).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Expreso' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Filtrado' })).toBeInTheDocument();

    expect(screen.getByRole('group', { name: 'Tamanio' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Pocillo' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Mediano' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Taza grande' })).toBeInTheDocument();

    expect(screen.getByRole('group', { name: 'Origen' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Colombia' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Etiopia' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Brasil' })).toBeInTheDocument();
  });

  it('cada origen muestra su descripcion: acidez, cuerpo y notas', () => {
    mostrarSelector();

    expect(screen.getByText('Acidez media, cuerpo equilibrado y notas citricas y florales')).toBeInTheDocument();
    expect(screen.getByText('Acidez muy viva, cuerpo ligero y notas frutales')).toBeInTheDocument();
    expect(screen.getByText('Acidez baja, cuerpo denso y notas de avellana')).toBeInTheDocument();
  });

  it('no hay nada elegido al principio', () => {
    mostrarSelector();

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).not.toBeChecked();
    }
  });
});
