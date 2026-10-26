import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, afterEach } from 'vitest';
import SecureDataMask from '../components/SecureDataMask.jsx';

describe('SecureDataMask - auto re-mask timeout', () => {
  afterEach(() => vi.useRealTimers());

  it('masks by default, reveals on click, and re-masks after 10 seconds', () => {
    vi.useFakeTimers();
    render(<SecureDataMask value="123456781234" label="Aadhaar number" />);
    const value = screen.getByTestId('secure-value');

    // 1. masked by default
    expect(value).toHaveTextContent('XXXX-XXXX-1234');

    // 2. click -> unmasked
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/i }));
    expect(value).toHaveTextContent('1234-5678-1234');
    expect(screen.getByRole('status')).toHaveTextContent(/revealed/i);

    // 3. just before 10s -> still visible
    act(() => { vi.advanceTimersByTime(9_999); });
    expect(value).toHaveTextContent('1234-5678-1234');

    // 4. at 10s -> masked again, real value gone from the DOM
    act(() => { vi.advanceTimersByTime(1); });
    expect(value).toHaveTextContent('XXXX-XXXX-1234');
    expect(screen.queryByText('1234-5678-1234')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/automatically hidden/i);
  });
});

describe('SecureDataMask - keyboard accessibility', () => {
  it('can be focused with Tab and has a toggle state', async () => {
    const user = userEvent.setup(); // real timers, so no hanging
    render(<SecureDataMask value="123456781234" />);
    await user.tab();
    const btn = screen.getByRole('button');
    expect(btn).toHaveFocus();
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('secure-value')).toHaveTextContent('1234-5678-1234');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });
});
