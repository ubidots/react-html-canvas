import { useEffect, useMemo, useRef } from 'react';
import { useUbidotsToken } from './useUbidotsSelections';
export interface UbidotsJSClient {
  authenticate: (token: string) => void;
}

export function useUbidotsAPI() {
  const token = useUbidotsToken();
  const clientRef = useRef<UbidotsJSClient | null>(null);

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = { authenticate: () => {} };
    }
    if (token) {
      clientRef.current.authenticate(token);
    }
  }, [token]);

  return useMemo(() => clientRef.current, []);
}
