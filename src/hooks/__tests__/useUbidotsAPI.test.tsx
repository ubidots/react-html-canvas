import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { UbidotsProvider } from '@/context/ubidots';
import { useUbidotsAPI } from '@/hooks/useUbidotsAPI';

function APIProbe({ onClient }: { onClient: (client: unknown) => void }) {
  const client = useUbidotsAPI();
  React.useEffect(() => {
    onClient(client);
  }, [client, onClient]);
  return null;
}

describe('useUbidotsAPI', () => {
  it('should return null when no token is available', () => {
    let capturedClient: unknown = undefined;

    render(
      <UbidotsProvider>
        <APIProbe onClient={c => (capturedClient = c)} />
      </UbidotsProvider>
    );

    expect(capturedClient).toBeNull();
  });

  it('should return authenticated client when token is provided', async () => {
    let capturedClient: unknown = null;

    function Tester() {
      React.useEffect(() => {
        window.postMessage(
          {
            event: 'receivedToken',
            payload: 'test-token-123',
          },
          '*'
        );
      }, []);

      return <APIProbe onClient={c => (capturedClient = c)} />;
    }

    render(
      <UbidotsProvider>
        <Tester />
      </UbidotsProvider>
    );

    await waitFor(() => {
      expect(capturedClient).not.toBeNull();
    });
  });
});
