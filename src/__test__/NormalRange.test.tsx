import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NormalRange from '@/app/components/Range/NomalRange';


global.fetch = jest.fn();

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ min: 1, max: 100 }),
  });
});

test('renders NormalRange component', () => {
  render(<NormalRange Currency="€" />);
  expect(screen.getByText("€ 1")).toBeInTheDocument();
  expect(screen.getByText("€ 100")).toBeInTheDocument();
});

test('allows setting min and max values', () => {
  render(<NormalRange Currency="€" />);
  
  const minValueSpan = screen.getByText("€ 1");
  fireEvent.click(minValueSpan);
  
  const minValueInput = screen.getByDisplayValue('1');
  fireEvent.change(minValueInput, { target: { value: '10' } });
  fireEvent.blur(minValueInput);
  
  expect(screen.getByText("€ 10")).toBeInTheDocument();
});

test('dragging handler-one changes value from 1 to 10', async () => {
  render(<NormalRange Currency="€" />);

  const minHandle = await screen.findByTestId("handler-one");

  fireEvent.mouseDown(minHandle);
  fireEvent.mouseMove(document, { clientX: 100 }); // Simula el arrastre a la derecha
  fireEvent.mouseUp(document);

  await waitFor(() => {
    expect(screen.getByText("€ 99")).toBeInTheDocument();
  });
});