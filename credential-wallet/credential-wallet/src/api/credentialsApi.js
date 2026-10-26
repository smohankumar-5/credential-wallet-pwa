// Mock for GET /api/credentials. Add ?fail or ?empty to the page URL to test other UI states.
const MOCK = [
  { id: '1', type: 'Aadhaar (Mock)', holder: 'Test User', number: '123456781234', issuedBy: 'UIDAI Sandbox' },
  { id: '2', type: 'eKYC Profile (Mock)', holder: 'Test User', number: '987654329876', issuedBy: 'UIDAI Sandbox' },
  { id: '3', type: 'Driving Licence (Mock)', holder: 'Test User', number: '556677885566', issuedBy: 'RTO Sandbox' },
];

export function fetchCredentials() {
  const q = window.location.search;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (q.includes('fail')) reject(new Error('Could not load credentials. Please try again.'));
      else resolve(q.includes('empty') ? [] : MOCK);
    }, 800);
  });
}
// With a real backend, replace the body with: fetch('/api/credentials').then(r => r.json())
// That request is what public/sw.js intercepts for offline support.
