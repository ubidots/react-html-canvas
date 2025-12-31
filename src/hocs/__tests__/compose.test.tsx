import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { UbidotsProvider } from '@/context/ubidots';
import { compose } from '@/hocs/compose';
import { withSelectedDevice } from '@/hocs/withSelectedDevice';
import { withUbidotsActions } from '@/hocs/withUbidotsActions';
import type { Device, UbidotsActions } from '@/types';

interface ComposedProps {
  selectedDevice?: Device | null;
  ubidotsActions?: UbidotsActions;
}

function DisplayComponent({ selectedDevice, ubidotsActions }: ComposedProps) {
  return (
    <div>
      <span data-testid='device'>{selectedDevice?.id || 'no-device'}</span>
      <span data-testid='actions'>
        {ubidotsActions ? 'has-actions' : 'no-actions'}
      </span>
    </div>
  );
}

describe('compose', () => {
  it('should compose multiple HOCs correctly', async () => {
    const enhance = compose<typeof DisplayComponent>(
      withUbidotsActions,
      withSelectedDevice
    );

    const EnhancedComponent = enhance(DisplayComponent);

    function Tester() {
      React.useEffect(() => {
        window.postMessage(
          { event: 'selectedDevice', payload: 'device-composed' },
          '*'
        );
      }, []);

      return <EnhancedComponent />;
    }

    render(
      <UbidotsProvider>
        <Tester />
      </UbidotsProvider>
    );

    const actionsElement = screen.getByTestId('actions');
    expect(actionsElement.textContent).toBe('has-actions');

    await waitFor(() => {
      const deviceElement = screen.getByTestId('device');
      expect(deviceElement.textContent).toBe('device-composed');
    });
  });

  it('should apply HOCs in right-to-left order', async () => {
    const appliedOrder: string[] = [];

    function makeTracingHOC(name: string) {
      return <P extends object>(Component: React.ComponentType<P>) => {
        return function Traced(props: P) {
          React.useEffect(() => {
            appliedOrder.push(name);
          }, []);
          return <Component {...props} />;
        };
      };
    }

    const TracedComponent = compose(
      makeTracingHOC('first'),
      makeTracingHOC('second'),
      makeTracingHOC('third')
    )(DisplayComponent);

    render(
      <UbidotsProvider>
        <TracedComponent />
      </UbidotsProvider>
    );

    await waitFor(() => {
      expect(appliedOrder).toEqual(['third', 'second', 'first']);
    });
  });

  it('should work with withSelectedDevice and withUbidotsActions together', async () => {
    const EnhancedComponent = compose<typeof DisplayComponent>(
      withSelectedDevice,
      withUbidotsActions
    )(DisplayComponent);

    function Tester() {
      React.useEffect(() => {
        window.postMessage(
          { event: 'selectedDevice', payload: 'integrated-device' },
          '*'
        );
        window.postMessage(
          { event: 'receivedToken', payload: 'integrated-token' },
          '*'
        );
      }, []);

      return <EnhancedComponent />;
    }

    render(
      <UbidotsProvider>
        <Tester />
      </UbidotsProvider>
    );

    const actionsElement = screen.getByTestId('actions');
    expect(actionsElement.textContent).toBe('has-actions');

    await waitFor(() => {
      const deviceElement = screen.getByTestId('device');
      expect(deviceElement.textContent).toBe('integrated-device');
    });
  });
});
