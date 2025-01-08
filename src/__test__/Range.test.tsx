import React from 'react';
import {  render, screen } from '@testing-library/react';
import Range from '@/app/components/Range/Range';


global.fetch = jest.fn();

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ getArrayValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] }),
  });
});

test('renders Range component', async () => {
  // Mock de fetch para devolver un JSON válido
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ getArrayValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99, 90.99] }),
  });

  render(<Range RangeMode="FixedValues" />);

  // Verifica que el componente renderiza correctamente
  expect(await screen.findByText(/€ 1.99/)).toBeInTheDocument();

  expect(await screen.findByText(/€ 70.99/)).toBeInTheDocument();
});




