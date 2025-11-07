import { useEffect, useRef, useState } from 'react';
import { useUbidotsToken } from './useUbidotsSelections';

export interface UbidotsJSClient extends Record<string, unknown> {
  Auth: { authenticate: (token: string) => void };
}

export function useUbidotsAPI(): UbidotsJSClient | null {
  const token = useUbidotsToken();
  const clientRef = useRef<UbidotsJSClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!clientRef.current) {
      setIsLoading(true);
      import('@ubidots/ubidots-javascript-library')
        .then(({ Ubidots }) => {
          clientRef.current = Ubidots as unknown as UbidotsJSClient;
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Failed to load Ubidots JavaScript Library:', error);
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (clientRef.current && token && !isLoading && !isAuthenticated) {
      clientRef.current.Auth.authenticate(token);
      setIsAuthenticated(true);
    }
  }, [token, isLoading, isAuthenticated]);

  if (!isAuthenticated || !clientRef.current) return null;
  return clientRef.current;
}
