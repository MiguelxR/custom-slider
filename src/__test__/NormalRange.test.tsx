import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import NormalRange from '@/app/components/Range/NomalRange';


global.fetch = jest.fn();

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ min: 1, max: 100 }),
  });
});

afterEach(() => {
  cleanup();
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

test('dragging handler-one changes value from 1 to 99', async () => {
  render(<NormalRange Currency="€" />);

  const minHandle = await screen.findByTestId("handler-one");

  fireEvent.mouseDown(minHandle);
  fireEvent.mouseMove(document, { clientX: 100 }); 
  fireEvent.mouseUp(document);

  await waitFor(() => {
    expect(screen.getByText("€ 99")).toBeInTheDocument();
  });
});

test('dragging handler-two changes value from 99 to 2', async () => {
  render(<NormalRange Currency="€" />);

  const maxHandle = await screen.findByTestId("handler-two");

  fireEvent.mouseDown(maxHandle);
  fireEvent.mouseMove(document, { clientX: -100 }); 
  fireEvent.mouseUp(document);

  await waitFor(() => {
    expect(screen.getByText("€ 2")).toBeInTheDocument();
  });
});


test('min value cannot exceed max value', async () => {
  render(<NormalRange Currency="€" />);

  const minValueSpan = screen.getByText("€ 1");
  fireEvent.click(minValueSpan);

  const minValueInput = screen.getByDisplayValue('1');
  fireEvent.change(minValueInput, { target: { value: '101' } });
  fireEvent.blur(minValueInput);

  await waitFor(() => {
    expect(screen.getByText("€ 1")).toBeInTheDocument(); 
  });
});


test('max value cannot be less than min value', async () => {
  render(<NormalRange Currency="€" />);

  const maxValueSpan = screen.getByText("€ 100");
  fireEvent.click(maxValueSpan);

  const maxValueInput = screen.getByDisplayValue('100');
  fireEvent.change(maxValueInput, { target: { value: '0' } });
  fireEvent.blur(maxValueInput);

  await waitFor(() => {
    expect(screen.getByText("€ 100")).toBeInTheDocument(); 
  });
});