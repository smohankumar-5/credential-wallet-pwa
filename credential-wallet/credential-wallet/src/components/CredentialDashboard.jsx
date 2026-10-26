import { useEffect } from 'react';
import { useCredentials } from '../store/CredentialContext.jsx';
import SecureDataMask from './SecureDataMask.jsx';

export default function CredentialDashboard() {
  const { status, items, error, loadCredentials } = useCredentials();

  useEffect(() => { loadCredentials(); }, [loadCredentials]);

  if (status === 'idle' || status === 'loading') {
    return <p role="status" aria-live="polite">Loading credentials…</p>;
  }
  if (status === 'error') {
    return (
      <div role="alert" className="state error">
        <p>{error}</p>
        <button onClick={loadCredentials}>Retry</button>
      </div>
    );
  }
  if (items.length === 0) {
    return <p className="state empty">You have no credentials yet.</p>;
  }

  return (
    <ul className="grid" aria-label="Your credentials">
      {items.map((c) => (
        <li key={c.id} className="card">
          <h2>{c.type}</h2>
          <p>Holder: {c.holder}</p>
          <p>Issued by: {c.issuedBy}</p>
          <SecureDataMask value={c.number} label={`${c.type} number`} />
        </li>
      ))}
    </ul>
  );
}
