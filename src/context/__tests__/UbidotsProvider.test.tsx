import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { UbidotsProvider } from '../ubidots';
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

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { event: 'receivedToken', payload: 'T' },
        origin: 'http://localhost',
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { event: 'selectedDevice', payload: 'd1' },
        origin: 'http://localhost',
      })
    );

    await waitFor(() =>
      expect(screen.getByTestId('ready').textContent).toBe('true')
    );
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('device').textContent).toBe('d1');
  });

  it('sets ready in public dashboards without receivedToken event', async () => {
    const onReady = vi.fn();
    render(
      <UbidotsProvider readyEvents={['receivedToken']} onReady={onReady}>
        <Probe />
      </UbidotsProvider>
    );

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { event: 'receivedJWTToken', payload: 'jwt-token' },
        origin: 'http://localhost',
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { event: 'selectedDevice', payload: { id: 'd1' } },
        origin: 'http://localhost',
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          event: 'selectedDashboardDateRange',
          payload: { startTime: 1000, endTime: 2000 },
        },
        origin: 'http://localhost',
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          event: 'selectedDashboardObject',
          payload: { id: 'dashboard-1', name: 'Test Dashboard' },
        },
        origin: 'http://localhost',
      })
    );

    await waitFor(() =>
      expect(screen.getByTestId('ready').textContent).toBe('true')
    );
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('device').textContent).toBe('d1');
  });

  it('sets ready with regular token in public dashboards', async () => {
    const onReady = vi.fn();
    render(
      <UbidotsProvider readyEvents={['receivedJWTToken']} onReady={onReady}>
        <Probe />
      </UbidotsProvider>
    );

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { event: 'receivedToken', payload: 'regular-token' },
        origin: 'http://localhost',
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { event: 'selectedDevice', payload: { id: 'd2' } },
        origin: 'http://localhost',
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          event: 'selectedDashboardDateRange',
          payload: { startTime: 1000, endTime: 2000 },
        },
        origin: 'http://localhost',
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          event: 'selectedDashboardObject',
          payload: { id: 'dashboard-2' },
        },
        origin: 'http://localhost',
      })
    );

    await waitFor(() =>
      expect(screen.getByTestId('ready').textContent).toBe('true')
    );
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('device').textContent).toBe('d2');
  });

  it('does not set ready if state values are incomplete', async () => {
    const onReady = vi.fn();
    render(
      <UbidotsProvider readyEvents={['receivedToken']} onReady={onReady}>
        <Probe />
      </UbidotsProvider>
    );

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { event: 'receivedJWTToken', payload: 'jwt-token' },
        origin: 'http://localhost',
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { event: 'selectedDevice', payload: { id: 'd1' } },
        origin: 'http://localhost',
      })
    );

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByTestId('ready').textContent).toBe('false');
    expect(onReady).not.toHaveBeenCalled();
  });
});
