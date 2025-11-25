import { useEffect, useRef, useState } from 'react';
import { useUbidotsToken } from './useUbidotsSelections';
import { Ubidots } from '@ubidots/ubidots-javascript-library';

export interface UbidotsJSClient extends Record<string, unknown> {
  Auth: { authenticate: (token: string) => void };
}

export function useUbidotsAPI(): UbidotsJSClient | null {
  const token = useUbidotsToken();
  const clientRef = useRef<UbidotsJSClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!clientRef.current && Ubidots) {
      clientRef.current = Ubidots as unknown as UbidotsJSClient;
    }
  }, []);

  useEffect(() => {
    if (clientRef.current && token && !isAuthenticated) {
      clientRef.current.Auth.authenticate(token);
      setIsAuthenticated(true);
    }
  }, [token, isAuthenticated]);

  if (!isAuthenticated || !clientRef.current) return null;
  return clientRef.current;
}
