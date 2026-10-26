import { useCallback, useEffect, useRef, useState } from 'react';

export const REVEAL_MS = 10_000;

// "123456781234" -> "XXXX-XXXX-1234"
export const maskValue = (value) => `XXXX-XXXX-${String(value ?? '').slice(-4)}`;
const format = (v) => String(v).replace(/(\d{4})(?=\d)/g, '$1-');

export default function SecureDataMask({ value, label = 'Sensitive data' }) {
  // The real value is kept in state ONLY while revealed; otherwise it is null.
  const [revealed, setRevealed] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const timer = useRef(null);

  const hide = useCallback((msg) => {
    clearTimeout(timer.current);
    setRevealed(null);                       // clears the unmasked value from state
    setAnnouncement(msg || `${label} hidden.`);
  }, [label]);

  const reveal = () => {
    clearTimeout(timer.current);
    setRevealed(String(value));
    setAnnouncement(`${label} revealed. It will be hidden again in 10 seconds.`);
    timer.current = setTimeout(
      () => hide(`${label} automatically hidden for your security.`),
      REVEAL_MS
    );
  };

  // Clean up the timer if the component unmounts.
  useEffect(() => () => clearTimeout(timer.current), []);

  const isRevealed = revealed !== null;

  return (
    <div className="mask">
      <span data-testid="secure-value">
        {isRevealed ? format(revealed) : maskValue(value)}
      </span>
      <button
        type="button"
        onClick={isRevealed ? () => hide() : reveal}
        aria-pressed={isRevealed}
        aria-label={isRevealed ? `Hide ${label}` : `Tap to reveal ${label}`}
      >
        {isRevealed ? 'Hide' : 'Tap to Reveal'}
      </button>
      {/* Screen readers announce every state change through this live region */}
      <div role="status" aria-live="polite" className="sr-only">{announcement}</div>
    </div>
  );
}
