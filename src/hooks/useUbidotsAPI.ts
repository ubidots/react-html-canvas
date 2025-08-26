import { useEffect, useMemo, useRef } from 'react';
import { useUbidotsToken } from './useUbidotsSelections';

// Placeholder interface for the Ubidots JS SDK client
export interface UbidotsJSClient {
  authenticate: (token: string) => void;
}

export function useUbidotsAPI() {
  const token = useUbidotsToken();
  const clientRef = useRef<UbidotsJSClient | null>(null);

  useEffect(() => {
    if (!clientRef.current) {
      // In a real scenario, import or create the SDK instance here
      clientRef.current = {
        authenticate: () => {},
      };
    }
    if (token) {
      clientRef.current.authenticate(token);
    }
  }, [token]);

  return useMemo(() => clientRef.current, []);
}
