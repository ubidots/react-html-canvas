import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import React from 'react';
import { UbidotsProvider } from '@/context/ubidots';
import { useWidgetEvents } from '@/hooks/useWidgetEvents';

describe('useWidgetEvents', () => {
  let postMessageSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    postMessageSpy = vi.spyOn(window.parent, 'postMessage');
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    postMessageSpy.mockRestore();
    vi.restoreAllMocks();
  });

  describe('emitWidgetEvent', () => {
    it('should emit widget event with correct format when widgetId is provided via param', async () => {
      let emitFn: ((event: string, payload?: unknown) => void) | null = null;

      function TestComponent() {
        const { emitWidgetEvent } = useWidgetEvents('widget-123');
        emitFn = emitWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(emitFn).not.toBeNull();
      });

      act(() => {
        emitFn!('custom-event', { data: 'test' });
      });

      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          event: 'v2:widget:custom-event:widget-123',
          payload: { data: 'test' },
        },
        '*'
      );
    });

    it('should emit widget event with widgetId from provider', async () => {
      let emitFn: ((event: string, payload?: unknown) => void) | null = null;

      function TestComponent() {
        const { emitWidgetEvent } = useWidgetEvents();
        emitFn = emitWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider widgetId='provider-widget'>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(emitFn).not.toBeNull();
      });

      act(() => {
        emitFn!('test-event', { value: 42 });
      });

      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          event: 'v2:widget:test-event:provider-widget',
          payload: { value: 42 },
        },
        '*'
      );
    });

    it('should warn and not emit when widgetId is not defined', async () => {
      let emitFn: ((event: string, payload?: unknown) => void) | null = null;
      const consoleWarnSpy = vi.spyOn(console, 'warn');

      function TestComponent() {
        const { emitWidgetEvent } = useWidgetEvents();
        emitFn = emitWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(emitFn).not.toBeNull();
      });

      // Clear any previous calls (like from ready event)
      postMessageSpy.mockClear();

      act(() => {
        emitFn!('some-event', { data: 'test' });
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Cannot emit widget event: widgetId is not defined'
      );
      expect(postMessageSpy).not.toHaveBeenCalled();
    });

    it('should emit event without payload', async () => {
      let emitFn: ((event: string, payload?: unknown) => void) | null = null;

      function TestComponent() {
        const { emitWidgetEvent } = useWidgetEvents('widget-abc');
        emitFn = emitWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(emitFn).not.toBeNull();
      });

      act(() => {
        emitFn!('ping');
      });

      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          event: 'v2:widget:ping:widget-abc',
          payload: undefined,
        },
        '*'
      );
    });
  });

  describe('onWidgetEvent', () => {
    it('should register and invoke callback when matching event is received', async () => {
      const callback = vi.fn();
      let onEventFn:
        | ((event: string, cb: (payload: unknown) => void) => () => void)
        | null = null;

      function TestComponent() {
        const { onWidgetEvent } = useWidgetEvents('widget-123');
        onEventFn = onWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(onEventFn).not.toBeNull();
      });

      act(() => {
        onEventFn!('v2:widget:custom:other-widget', callback);
      });

      // Simulate receiving a widget event
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              event: 'v2:widget:custom:other-widget',
              payload: { test: 'data' },
            },
          })
        );
      });

      expect(callback).toHaveBeenCalledWith({ test: 'data' });
    });

    it('should return cleanup function that removes listener', async () => {
      const callback = vi.fn();
      let onEventFn:
        | ((event: string, cb: (payload: unknown) => void) => () => void)
        | null = null;

      function TestComponent() {
        const { onWidgetEvent } = useWidgetEvents('widget-123');
        onEventFn = onWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(onEventFn).not.toBeNull();
      });

      let cleanup: (() => void) | null = null;
      act(() => {
        cleanup = onEventFn!('v2:widget:test:widget-456', callback);
      });

      // Call cleanup
      act(() => {
        cleanup!();
      });

      // Simulate receiving the event after cleanup
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              event: 'v2:widget:test:widget-456',
              payload: { test: 'after-cleanup' },
            },
          })
        );
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should invoke wildcard listeners for any widget event', async () => {
      const wildcardCallback = vi.fn();
      let onEventFn:
        | ((event: string, cb: (payload: unknown) => void) => () => void)
        | null = null;

      function TestComponent() {
        const { onWidgetEvent } = useWidgetEvents('widget-123');
        onEventFn = onWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(onEventFn).not.toBeNull();
      });

      act(() => {
        onEventFn!('*', wildcardCallback);
      });

      // Simulate receiving any widget event
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              event: 'v2:widget:any-event:any-widget',
              payload: { wildcard: true },
            },
          })
        );
      });

      expect(wildcardCallback).toHaveBeenCalledWith({ wildcard: true });
    });
  });

  describe('onAnyWidgetEvent', () => {
    it('should invoke callback for any v2:widget event with event name and payload', async () => {
      const callback = vi.fn();
      let onAnyFn:
        | ((cb: (event: string, payload: unknown) => void) => () => void)
        | null = null;

      function TestComponent() {
        const { onAnyWidgetEvent } = useWidgetEvents('widget-123');
        onAnyFn = onAnyWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(onAnyFn).not.toBeNull();
      });

      let cleanup: (() => void) | null = null;
      act(() => {
        cleanup = onAnyFn!(callback);
      });

      // Simulate receiving a widget event
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              event: 'v2:widget:monitoring:widget-xyz',
              payload: { monitoring: true },
            },
          })
        );
      });

      expect(callback).toHaveBeenCalledWith('v2:widget:monitoring:widget-xyz', {
        monitoring: true,
      });

      // Cleanup
      act(() => {
        cleanup!();
      });
    });

    it('should NOT invoke callback for non-widget events', async () => {
      const callback = vi.fn();
      let onAnyFn:
        | ((cb: (event: string, payload: unknown) => void) => () => void)
        | null = null;

      function TestComponent() {
        const { onAnyWidgetEvent } = useWidgetEvents('widget-123');
        onAnyFn = onAnyWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(onAnyFn).not.toBeNull();
      });

      act(() => {
        onAnyFn!(callback);
      });

      // Simulate receiving a non-widget event
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              event: 'receivedToken',
              payload: 'some-token',
            },
          })
        );
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('widgetId return value', () => {
    it('should return widgetId passed as parameter', async () => {
      let returnedWidgetId: string | null | undefined = undefined;

      function TestComponent() {
        const { widgetId } = useWidgetEvents('param-widget');
        returnedWidgetId = widgetId;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(returnedWidgetId).toBe('param-widget');
      });
    });

    it('should return widgetId from context when no param provided', async () => {
      let returnedWidgetId: string | null | undefined = undefined;

      function TestComponent() {
        const { widgetId } = useWidgetEvents();
        returnedWidgetId = widgetId;
        return null;
      }

      render(
        <UbidotsProvider widgetId='context-widget'>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(returnedWidgetId).toBe('context-widget');
      });
    });

    it('should prefer param widgetId over context widgetId', async () => {
      let returnedWidgetId: string | null | undefined = undefined;

      function TestComponent() {
        const { widgetId } = useWidgetEvents('param-takes-priority');
        returnedWidgetId = widgetId;
        return null;
      }

      render(
        <UbidotsProvider widgetId='context-widget'>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(returnedWidgetId).toBe('param-takes-priority');
      });
    });
  });

  describe('lifecycle events', () => {
    it('should emit ready event when widget is ready', async () => {
      function TestComponent() {
        useWidgetEvents('lifecycle-widget');
        return null;
      }

      render(
        <UbidotsProvider widgetId='lifecycle-widget' readyEvents={[]}>
          <TestComponent />
        </UbidotsProvider>
      );

      // Wait for ready event to be emitted
      await waitFor(() => {
        const readyCall = postMessageSpy.mock.calls.find(
          call =>
            call[0] &&
            typeof call[0] === 'object' &&
            'event' in call[0] &&
            call[0].event === 'v2:widget:ready:lifecycle-widget'
        );
        expect(readyCall).toBeDefined();
      });

      const readyCall = postMessageSpy.mock.calls.find(
        call =>
          call[0] &&
          typeof call[0] === 'object' &&
          'event' in call[0] &&
          call[0].event === 'v2:widget:ready:lifecycle-widget'
      );

      expect(readyCall![0]).toMatchObject({
        event: 'v2:widget:ready:lifecycle-widget',
        payload: expect.objectContaining({
          widgetId: 'lifecycle-widget',
          timestamp: expect.any(Number),
        }),
      });
    });
  });

  describe('message event filtering', () => {
    it('should ignore non-widget events in the internal listener', async () => {
      const callback = vi.fn();
      let onEventFn:
        | ((event: string, cb: (payload: unknown) => void) => () => void)
        | null = null;

      function TestComponent() {
        const { onWidgetEvent } = useWidgetEvents('widget-123');
        onEventFn = onWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(onEventFn).not.toBeNull();
      });

      act(() => {
        onEventFn!('receivedToken', callback);
      });

      // Simulate receiving a V1 event (not a widget event)
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              event: 'receivedToken',
              payload: 'token-value',
            },
          })
        );
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle messages without event property', async () => {
      const callback = vi.fn();
      let onEventFn:
        | ((event: string, cb: (payload: unknown) => void) => () => void)
        | null = null;

      function TestComponent() {
        const { onWidgetEvent } = useWidgetEvents('widget-123');
        onEventFn = onWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(onEventFn).not.toBeNull();
      });

      act(() => {
        onEventFn!('*', callback);
      });

      // Simulate receiving a message without event property
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { someOtherProperty: 'value' },
          })
        );
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle null message data', async () => {
      const callback = vi.fn();
      let onEventFn:
        | ((event: string, cb: (payload: unknown) => void) => () => void)
        | null = null;

      function TestComponent() {
        const { onWidgetEvent } = useWidgetEvents('widget-123');
        onEventFn = onWidgetEvent;
        return null;
      }

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      await waitFor(() => {
        expect(onEventFn).not.toBeNull();
      });

      act(() => {
        onEventFn!('*', callback);
      });

      // Simulate receiving a message with null data
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: null,
          })
        );
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
