import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { UbidotsProvider } from '../UbidotsProvider';
import { useUbidotsReady, useUbidotsSelectedDevice } from '@/hooks';

function Probe() {
  const ready = useUbidotsReady();
  const device = useUbidotsSelectedDevice();
  return (
    <div>
      <div data-testid='ready'>{String(ready)}</div>
      <div data-testid='device'>{device?.id ?? ''}</div>
    </div>
  );
}

describe('UbidotsProvider', () => {
  it('sets ready when required events arrive', async () => {
    const onReady = vi.fn();
    render(
      <UbidotsProvider
        readyEvents={['receivedToken', 'selectedDevice']}
        onReady={onReady}
      >
        <Probe />
      </UbidotsProvider>
    );

    // simulate messages
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { event: 'receivedToken', payload: 'T' },
        origin: 'http://localhost',
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { event: 'selectedDevice', payload: { id: 'd1' } },
        origin: 'http://localhost',
      })
    );

    await waitFor(() =>
      expect(screen.getByTestId('ready').textContent).toBe('true')
    );
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('device').textContent).toBe('d1');
  });
});
