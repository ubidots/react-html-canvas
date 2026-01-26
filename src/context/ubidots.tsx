/**
 * Consolidated Ubidots implementation
 *
 * This file contains the context, hook, and provider all in one place.
 * Only exports the hook and context for internal use.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type { UbidotsState, UbidotsActions, ReadyEvent } from '@/types';
import { initialState, ubidotsReducer } from './UbidotsReducer';
import { handleInboundMessage, checkReadyState } from './messageHandlers';
import { createActions } from './actions';
import { ACTION_TYPES, DEFAULT_READY_EVENTS } from './constants';

export interface UbidotsContextValue {
  state: UbidotsState;
  actions: UbidotsActions;
}

const UbidotsContext = createContext<UbidotsContextValue | undefined>(
  undefined
);

/**
 * Main hook for accessing Ubidots context
 *
 * This hook provides access to the Ubidots state and actions.
 * Must be used within a UbidotsProvider component.
 *
 * @returns The context value containing state and actions
 * @throws If used outside of UbidotsProvider
 */
export function useUbidots() {
  const ctx = useContext(UbidotsContext);
  if (!ctx) throw new Error('useUbidots must be used within UbidotsProvider');
  return ctx;
}

export interface UbidotsProviderProps {
  children: React.ReactNode;
  onReady?: () => void;
  readyEvents?: ReadyEvent[];
  validateOrigin?: (origin: string) => boolean;
  initialStateOverride?: Partial<typeof initialState>;
  widgetId?: string;
}

export function UbidotsProvider({
  children,
  onReady,
  readyEvents = DEFAULT_READY_EVENTS,
  validateOrigin,
  initialStateOverride,
  widgetId,
}: UbidotsProviderProps) {
  const [state, dispatch] = useReducer(ubidotsReducer, {
    ...initialState,
    ...initialStateOverride,
  });
  const readyRef = useRef(false);
  const satisfiedEventsRef = useRef(new Set<ReadyEvent>());

  // Set widgetId on window and in state
  useEffect(() => {
    if (widgetId) {
      (window as unknown as Record<string, unknown>).widgetId = widgetId;
      dispatch({ type: ACTION_TYPES.SET_WIDGET_ID, payload: widgetId });
    }
  }, [widgetId]);

  const isOriginValid = useCallback(
    (origin: string) => (validateOrigin ? validateOrigin(origin) : true),
    [validateOrigin]
  );

  useEffect(() => {
    function handleMessage(ev: MessageEvent) {
      if (!isOriginValid(ev.origin)) return;
      const { event, payload } = (ev.data || {}) as {
        event?: string;
        payload?: unknown;
      };

      if (event) {
        handleInboundMessage(event, payload, dispatch, satisfiedEventsRef);
        checkReadyState(
          readyEvents,
          satisfiedEventsRef,
          readyRef,
          dispatch,
          state,
          onReady
        );
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOriginValid, onReady, readyEvents, state]);

  useEffect(() => {
    checkReadyState(
      readyEvents,
      satisfiedEventsRef,
      readyRef,
      dispatch,
      state,
      onReady
    );
  }, [state, readyEvents, onReady]);

  const actions = useMemo(
    () => createActions(state.jwtToken, state.token),
    [state.jwtToken, state.token]
  );

  const value = useMemo<UbidotsContextValue>(
    () => ({ state, actions }),
    [state, actions]
  );

  return (
    <UbidotsContext.Provider value={value}>{children}</UbidotsContext.Provider>
  );
}
