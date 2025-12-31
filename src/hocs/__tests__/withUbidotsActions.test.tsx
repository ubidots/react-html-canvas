import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { UbidotsProvider } from '@/context/ubidots';
import { withUbidotsActions } from '@/hocs/withUbidotsActions';
import type { UbidotsActions } from '@/types';

interface TestComponentProps {
  ubidotsActions?: UbidotsActions;
  customProp?: string;
}

function TestComponent({ ubidotsActions, customProp }: TestComponentProps) {
  return (
    <div>
      <span data-testid='has-actions'>
        {ubidotsActions ? 'has-actions' : 'no-actions'}
      </span>
      <span data-testid='custom-prop'>{customProp || 'no-custom'}</span>
      {ubidotsActions && (
        <span data-testid='action-count'>
          {Object.keys(ubidotsActions).length}
        </span>
      )}
    </div>
  );
}

const WrappedComponent = withUbidotsActions(TestComponent);

describe('withUbidotsActions', () => {
  it('should inject ubidotsActions prop into wrapped component', () => {
    render(
      <UbidotsProvider>
        <WrappedComponent />
      </UbidotsProvider>
    );

    const actionsElement = screen.getByTestId('has-actions');
    expect(actionsElement.textContent).toBe('has-actions');
  });

  it('should pass through other props', () => {
    render(
      <UbidotsProvider>
        <WrappedComponent customProp='test-value' />
      </UbidotsProvider>
    );

    const customElement = screen.getByTestId('custom-prop');
    expect(customElement.textContent).toBe('test-value');

    const actionsElement = screen.getByTestId('has-actions');
    expect(actionsElement.textContent).toBe('has-actions');
  });

  it('should provide all action methods', () => {
    const postSpy = vi.spyOn(window.parent, 'postMessage');

    function InteractiveTest() {
      const [called, setCalled] = React.useState(false);

      return (
        <>
          <WrappedComponent />
          <button
            data-testid='call-action'
            onClick={() => {
              window.postMessage(
                { event: 'receivedToken', payload: 'test-token' },
                '*'
              );
              setCalled(true);
            }}
          >
            Call
          </button>
          {called && <span data-testid='called'>called</span>}
        </>
      );
    }

    render(
      <UbidotsProvider>
        <InteractiveTest />
      </UbidotsProvider>
    );

    const actionCountElement = screen.getByTestId('action-count');
    expect(parseInt(actionCountElement.textContent || '0')).toBeGreaterThan(5);

    postSpy.mockRestore();
  });
});
