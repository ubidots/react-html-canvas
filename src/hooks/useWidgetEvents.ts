import { useCallback, useEffect, useRef } from 'react';
import { useUbidots } from '../context/ubidots';
import { useUbidotsWidgetId } from './useUbidotsSelections';

/**
 * Hook for emitting and listening to widget-specific events
 *
 * Widget events follow the pattern: v2:widget:<widgetId>:<event>
 * This allows multiple widgets to coexist with isolated event namespaces.
 * Use the wildcard pattern v2:widget:<widgetId>:* to listen to all events
 * from a specific widget.
 */
export function useWidgetEvents(widgetIdParam?: string) {
  const { state } = useUbidots();
  const contextWidgetId = useUbidotsWidgetId();
  const widgetId = widgetIdParam || contextWidgetId;
  const listenersRef = useRef<Map<string, Set<(payload: unknown) => void>>>(
    new Map()
  );

  /**
   * Emit a widget-specific event
   *
   * @param event - The event name (without the v2:widget prefix)
   * @param payload - The event payload
   */
  const emitWidgetEvent = useCallback(
    (event: string, payload?: unknown) => {
      if (!widgetId) {
        console.warn('Cannot emit widget event: widgetId is not defined');
        return;
      }

      const eventName = `v2:widget:${widgetId}:${event}`;

      // Emit to parent window
      window.parent.postMessage(
        {
          event: eventName,
          payload,
        },
        '*'
      );
    },
    [widgetId]
  );

  /**
   * Listen to widget-specific events from other widgets
   *
   * @param event - The event name pattern to listen for
   * @param callback - The callback to invoke when the event is received
   */
  const onWidgetEvent = useCallback(
    (event: string, callback: (payload: unknown) => void) => {
      if (!listenersRef.current.has(event)) {
        listenersRef.current.set(event, new Set());
      }
      listenersRef.current.get(event)?.add(callback);

      // Return cleanup function
      return () => {
        listenersRef.current.get(event)?.delete(callback);
      };
    },
    []
  );

  /**
   * Listen to all widget events (for monitoring/debugging)
   */
  const onAnyWidgetEvent = useCallback(
    (callback: (event: string, payload: unknown) => void) => {
      const handleMessage = (ev: MessageEvent) => {
        const { event, payload } = (ev.data || {}) as {
          event?: string;
          payload?: unknown;
        };

        if (event && event.startsWith('v2:widget:')) {
          callback(event, payload);
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    },
    []
  );

  // Set up message listener for widget events
  useEffect(() => {
    const handleMessage = (ev: MessageEvent) => {
      const { event, payload } = (ev.data || {}) as {
        event?: string;
        payload?: unknown;
      };

      if (!event || !event.startsWith('v2:widget:')) {
        return;
      }

      // Notify all listeners for this specific event
      listenersRef.current.get(event)?.forEach(callback => {
        callback(payload);
      });

      // Notify wildcard listeners (e.g. "v2:widget:<widgetId>:*")
      listenersRef.current.forEach((callbacks, key) => {
        if (key.endsWith(':*') && event.startsWith(key.slice(0, -1))) {
          callbacks.forEach(cb => cb(payload));
        }
      });
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Emit lifecycle events
  useEffect(() => {
    if (widgetId && state.ready) {
      emitWidgetEvent('ready', { widgetId, timestamp: Date.now() });
    }
  }, [widgetId, state.ready, emitWidgetEvent]);

  return {
    emitWidgetEvent,
    onWidgetEvent,
    onAnyWidgetEvent,
    widgetId,
  };
}
