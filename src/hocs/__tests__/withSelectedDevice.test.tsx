import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { UbidotsProvider } from '@/context/ubidots';
import { withSelectedDevice } from '@/hocs/withSelectedDevice';
import type { Device } from '@/types';

interface TestComponentProps {
  selectedDevice?: Device | null;
  customProp?: string;
}

function TestComponent({ selectedDevice, customProp }: TestComponentProps) {
  return (
    <div>
      <span data-testid='device-id'>{selectedDevice?.id || 'no-device'}</span>
      <span data-testid='custom-prop'>{customProp || 'no-custom'}</span>
    </div>
  );
}

const WrappedComponent = withSelectedDevice(TestComponent);

describe('withSelectedDevice', () => {
  it('should inject selectedDevice prop into wrapped component', async () => {
    function Tester() {
      React.useEffect(() => {
        window.postMessage(
          { event: 'selectedDevice', payload: 'device-123' },
          '*'
        );
      }, []);

      return <WrappedComponent />;
    }

    render(
      <UbidotsProvider>
        <Tester />
      </UbidotsProvider>
    );

    await waitFor(() => {
      const deviceElement = screen.getByTestId('device-id');
      expect(deviceElement.textContent).toBe('device-123');
    });
  });

  it('should pass through other props', () => {
    function Tester() {
      React.useEffect(() => {
        window.postMessage(
          { event: 'selectedDevice', payload: 'device-abc' },
          '*'
        );
      }, []);

      return <WrappedComponent customProp='test-value' />;
    }

    render(
      <UbidotsProvider>
        <Tester />
      </UbidotsProvider>
    );

    const customElement = screen.getByTestId('custom-prop');
    expect(customElement.textContent).toBe('test-value');
  });

  it('should update when selectedDevice changes in context', async () => {
    function Tester() {
      const [step, setStep] = React.useState(0);

      React.useEffect(() => {
        if (step === 0) {
          window.postMessage(
            { event: 'selectedDevice', payload: 'device-initial' },
            '*'
          );
          setTimeout(() => setStep(1), 50);
        } else if (step === 1) {
          window.postMessage(
            { event: 'selectedDevice', payload: 'device-updated' },
            '*'
          );
        }
      }, [step]);

      return <WrappedComponent />;
    }

    render(
      <UbidotsProvider>
        <Tester />
      </UbidotsProvider>
    );

    await waitFor(() => {
      const deviceElement = screen.getByTestId('device-id');
      expect(deviceElement.textContent).toBe('device-updated');
    });
  });

  it('should handle null selectedDevice', () => {
    render(
      <UbidotsProvider>
        <WrappedComponent />
      </UbidotsProvider>
    );

    const deviceElement = screen.getByTestId('device-id');
    expect(deviceElement.textContent).toBe('no-device');
  });
});
