import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Natural Language to ER Diagram/i);
  expect(headingElement).toBeInTheDocument();
});