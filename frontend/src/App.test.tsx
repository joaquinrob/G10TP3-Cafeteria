import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('muestra el titulo de la cafeteria', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Cafeteria Origen' })).toBeInTheDocument();
  });
});
