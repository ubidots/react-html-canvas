import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { UbidotsProvider } from '@/context/ubidots';
import {
  useUbidotsToken,
  useUbidotsJWT,
  useUbidotsSelectedDevice,
  useUbidotsSelectedDevices,
  useUbidotsDashboardDateRange,
  useUbidotsRealTimeStatus,
  useUbidotsDeviceObject,
  useUbidotsDashboardObject,
  useUbidotsWidget,
  useUbidotsSelectedDeviceObjects,
  useUbidotsSelectedFilters,
  useUbidotsWidgetId,
} from '@/hooks/useUbidotsSelections';
import type {
  Device,
  DateRange,
  DashboardObject,
  DeviceObject,
  FilterValue,
  WidgetInfo,
} from '@/types';

interface SelectionProbeProps<T> {
  hookFn: () => T;
  onValue: (value: T) => void;
}

function SelectionProbe<T>({ hookFn, onValue }: SelectionProbeProps<T>) {
  const value = hookFn();
  React.useEffect(() => {
    onValue(value);
  }, [value, onValue]);
  return null;
}

describe('useUbidotsSelections', () => {
  describe('All selection hooks return correct state values from context', () => {
    it('useUbidotsToken returns token', async () => {
      let capturedValue: string | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage(
            { event: 'receivedToken', payload: 'test-token-123' },
            '*'
          );
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsToken}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toBe('test-token-123');
      });
    });

    it('useUbidotsJWT returns JWT token', async () => {
      let capturedValue: string | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage(
            { event: 'receivedJWTToken', payload: 'jwt-token-abc' },
            '*'
          );
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsJWT}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toBe('jwt-token-abc');
      });
    });

    it('useUbidotsSelectedDevice returns selected device', async () => {
      let capturedValue: Device | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage(
            { event: 'selectedDevice', payload: 'device-123' },
            '*'
          );
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsSelectedDevice}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toEqual({ id: 'device-123' });
      });
    });

    it('useUbidotsSelectedDevices returns device array', async () => {
      let capturedValue: Device[] | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage(
            {
              event: 'selectedDevices',
              payload: [{ id: 'dev1' }, { id: 'dev2' }],
            },
            '*'
          );
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsSelectedDevices}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toEqual([{ id: 'dev1' }, { id: 'dev2' }]);
      });
    });

    it('useUbidotsDashboardDateRange returns date range', async () => {
      let capturedValue: DateRange | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage(
            {
              event: 'selectedDashboardDateRange',
              payload: { startTime: 1000, endTime: 2000 },
            },
            '*'
          );
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsDashboardDateRange}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toEqual({ startTime: 1000, endTime: 2000 });
      });
    });

    it('useUbidotsRealTimeStatus returns real-time status', async () => {
      let capturedValue: boolean | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage({ event: 'isRealTimeActive', payload: true }, '*');
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsRealTimeStatus}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toBe(true);
      });
    });

    it('useUbidotsDeviceObject returns device object', async () => {
      let capturedValue: DeviceObject | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage(
            {
              event: 'selectedDeviceObject',
              payload: { id: 'obj-1', name: 'Device' },
            },
            '*'
          );
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsDeviceObject}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toEqual({ id: 'obj-1', name: 'Device' });
      });
    });

    it('useUbidotsDashboardObject returns dashboard object', async () => {
      let capturedValue: DashboardObject | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage(
            {
              event: 'selectedDashboardObject',
              payload: { id: 'dash-1', name: 'Dashboard' },
            },
            '*'
          );
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsDashboardObject}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toEqual({ id: 'dash-1', name: 'Dashboard' });
      });
    });

    it('useUbidotsWidget returns widget', async () => {
      let capturedValue: WidgetInfo | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage(
            { event: 'receivedToken', payload: 'token-for-widget' },
            '*'
          );
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsWidget}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toBeNull();
      });
    });

    it('useUbidotsSelectedDeviceObjects returns device objects array', async () => {
      let capturedValue: DeviceObject[] | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage(
            {
              event: 'selectedDeviceObjects',
              payload: [
                { id: 'obj1', name: 'Device 1' },
                { id: 'obj2', name: 'Device 2' },
              ],
            },
            '*'
          );
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsSelectedDeviceObjects}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toEqual([
          { id: 'obj1', name: 'Device 1' },
          { id: 'obj2', name: 'Device 2' },
        ]);
      });
    });

    it('useUbidotsSelectedFilters returns filters', async () => {
      let capturedValue: FilterValue[] | null = null;

      function Tester() {
        React.useEffect(() => {
          window.postMessage(
            {
              event: 'selectedFilters',
              payload: [
                { id: 'filter1', value: 'value1' },
                { id: 'filter2', value: 'value2' },
              ],
            },
            '*'
          );
        }, []);

        return (
          <SelectionProbe
            hookFn={useUbidotsSelectedFilters}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toEqual([
          { id: 'filter1', value: 'value1' },
          { id: 'filter2', value: 'value2' },
        ]);
      });
    });

    it('useUbidotsWidgetId returns widgetId from provider prop', async () => {
      let capturedValue: string | null = null;

      function Tester() {
        return (
          <SelectionProbe
            hookFn={useUbidotsWidgetId}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider widgetId='test-widget-123'>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toBe('test-widget-123');
      });
    });

    it('useUbidotsWidgetId returns null when widgetId is not provided', async () => {
      let capturedValue: string | null = 'initial';

      function Tester() {
        return (
          <SelectionProbe
            hookFn={useUbidotsWidgetId}
            onValue={v => (capturedValue = v)}
          />
        );
      }

      render(
        <UbidotsProvider>
          <Tester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(capturedValue).toBeNull();
      });
    });
  });

  describe('Hooks update when context state changes', () => {
    it('selection hooks reflect state updates', async () => {
      let tokenValue: string | null = null;
      let deviceValue: Device | null = null;

      function DualTester() {
        const [step, setStep] = React.useState(0);

        React.useEffect(() => {
          if (step === 0) {
            window.postMessage(
              { event: 'receivedToken', payload: 'initial-token' },
              '*'
            );
            setTimeout(() => setStep(1), 50);
          } else if (step === 1) {
            window.postMessage(
              { event: 'selectedDevice', payload: 'device-xyz' },
              '*'
            );
          }
        }, [step]);

        const token = useUbidotsToken();
        const device = useUbidotsSelectedDevice();

        React.useEffect(() => {
          tokenValue = token;
          deviceValue = device;
        }, [token, device]);

        return null;
      }

      render(
        <UbidotsProvider>
          <DualTester />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(tokenValue).toBe('initial-token');
        expect(deviceValue).toEqual({ id: 'device-xyz' });
      });
    });
  });
});
