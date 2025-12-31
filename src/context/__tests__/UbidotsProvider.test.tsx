import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
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

    act(() => {
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
    });

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

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { event: 'receivedJWTToken', payload: 'jwt-token' },
          origin: 'http://localhost',
        })
      );
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { event: 'selectedDevice', payload: 'd1' },
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
    });

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

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { event: 'receivedToken', payload: 'regular-token' },
          origin: 'http://localhost',
        })
      );
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { event: 'selectedDevice', payload: 'd2' },
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
    });

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

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { event: 'receivedJWTToken', payload: 'jwt-token' },
          origin: 'http://localhost',
        })
      );
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { event: 'selectedDevice', payload: 'd1' },
          origin: 'http://localhost',
        })
      );
    });

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByTestId('ready').textContent).toBe('false');
    expect(onReady).not.toHaveBeenCalled();
  });

  it('handles selectedDevices array event', async () => {
    const { useUbidotsSelectedDevices } = await import('@/hooks');
    function DevicesProbe() {
      const devices = useUbidotsSelectedDevices();
      return (
        <div data-testid='devices'>
          {devices?.map(d => d.id).join(',') || 'none'}
        </div>
      );
    }

    render(
      <UbidotsProvider>
        <DevicesProbe />
      </UbidotsProvider>
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            event: 'selectedDevices',
            payload: [{ id: 'dev1' }, { id: 'dev2' }, { id: 'dev3' }],
          },
          origin: 'http://localhost',
        })
      );
    });

    await waitFor(() =>
      expect(screen.getByTestId('devices').textContent).toBe('dev1,dev2,dev3')
    );
  });

  it('handles device object and device objects events', async () => {
    const { useUbidotsDeviceObject, useUbidotsSelectedDeviceObjects } =
      await import('@/hooks');
    function DeviceObjectsProbe() {
      const deviceObject = useUbidotsDeviceObject();
      const deviceObjects = useUbidotsSelectedDeviceObjects();
      return (
        <div>
          <div data-testid='device-object'>{deviceObject?.id || 'none'}</div>
          <div data-testid='device-objects'>
            {deviceObjects?.map(d => d.id).join(',') || 'none'}
          </div>
        </div>
      );
    }

    render(
      <UbidotsProvider>
        <DeviceObjectsProbe />
      </UbidotsProvider>
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            event: 'selectedDeviceObject',
            payload: { id: 'obj-1', name: 'Device Object 1' },
          },
          origin: 'http://localhost',
        })
      );
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            event: 'selectedDeviceObjects',
            payload: [
              { id: 'obj-1', name: 'Object 1' },
              { id: 'obj-2', name: 'Object 2' },
            ],
          },
          origin: 'http://localhost',
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('device-object').textContent).toBe('obj-1');
      expect(screen.getByTestId('device-objects').textContent).toBe(
        'obj-1,obj-2'
      );
    });
  });

  it('handles selected filters event', async () => {
    const { useUbidotsSelectedFilters } = await import('@/hooks');
    function FiltersProbe() {
      const filters = useUbidotsSelectedFilters();
      return (
        <div data-testid='filters'>
          {filters?.map(f => f.id).join(',') || 'none'}
        </div>
      );
    }

    render(
      <UbidotsProvider>
        <FiltersProbe />
      </UbidotsProvider>
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            event: 'selectedFilters',
            payload: [
              { id: 'filter-1', value: 'val1' },
              { id: 'filter-2', value: 'val2' },
            ],
          },
          origin: 'http://localhost',
        })
      );
    });

    await waitFor(() =>
      expect(screen.getByTestId('filters').textContent).toBe(
        'filter-1,filter-2'
      )
    );
  });

  it('handles real-time status event', async () => {
    const { useUbidotsRealTimeStatus } = await import('@/hooks');
    function RealTimeProbe() {
      const realTime = useUbidotsRealTimeStatus();
      return <div data-testid='realtime'>{String(realTime)}</div>;
    }

    render(
      <UbidotsProvider>
        <RealTimeProbe />
      </UbidotsProvider>
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { event: 'isRealTimeActive', payload: true },
          origin: 'http://localhost',
        })
      );
    });

    await waitFor(() =>
      expect(screen.getByTestId('realtime').textContent).toBe('true')
    );
  });
});
