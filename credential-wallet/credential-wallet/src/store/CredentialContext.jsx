import { createContext, useCallback, useContext, useReducer } from 'react';
import { fetchCredentials } from '../api/credentialsApi.js';

const initialState = { status: 'idle', items: [], error: null };

export function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':   return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS': return { status: 'success', items: action.payload, error: null };
    case 'FETCH_ERROR':   return { ...state, status: 'error', error: action.payload };
    default:              return state;
  }
}

const CredentialContext = createContext(null);

export function CredentialProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadCredentials = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      dispatch({ type: 'FETCH_SUCCESS', payload: await fetchCredentials() });
    } catch (e) {
      dispatch({ type: 'FETCH_ERROR', payload: e.message });
    }
  }, []);

  return (
    <CredentialContext.Provider value={{ ...state, loadCredentials }}>
      {children}
    </CredentialContext.Provider>
  );
}

export const useCredentials = () => {
  const ctx = useContext(CredentialContext);
  if (!ctx) throw new Error('useCredentials must be used inside CredentialProvider');
  return ctx;
};
