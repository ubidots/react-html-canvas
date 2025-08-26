import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { UbidotsContext } from './UbidotsContext';
import type { UbidotsContextValue } from './UbidotsContext';
import { initialState, ubidotsReducer } from './UbidotsReducer';
import type {
  Device,
  DateRange,
  DashboardObject,
  DeviceObject,
  OutboundActions,
  ReadyEvent,
} from '@/types';

export interface UbidotsProviderProps {
  children: React.ReactNode;
  onReady?: () => void;
  readyEvents?: ReadyEvent[];
  validateOrigin?: (origin: string) => boolean;
  initialStateOverride?: Partial<typeof initialState>;
}

const DEFAULT_READY_EVENTS: ReadyEvent[] = ['receivedToken'];

export function UbidotsProvider({
  children,
  onReady,
  readyEvents = DEFAULT_READY_EVENTS,
  validateOrigin,
  initialStateOverride,
}: UbidotsProviderProps) {
  const [state, dispatch] = useReducer(ubidotsReducer, {
    ...initialState,
    ...initialStateOverride,
  });
  const readyRef = useRef(false);
  const satisfiedEventsRef = useRef(new Set<ReadyEvent>());

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
      switch (event) {
        case 'receivedToken':
          dispatch({ type: 'RECEIVED_TOKEN', payload: payload as string });
          satisfiedEventsRef.current.add('receivedToken');
          break;
        case 'receivedJWTToken':
          dispatch({ type: 'RECEIVED_JWT_TOKEN', payload: payload as string });
          satisfiedEventsRef.current.add('receivedJWTToken');
          break;
        case 'selectedDevice':
          dispatch({
            type: 'SELECTED_DEVICE',
            payload: payload as Device | null,
          });
          satisfiedEventsRef.current.add('selectedDevice');
          break;
        case 'selectedDevices':
          dispatch({
            type: 'SELECTED_DEVICES',
            payload: payload as Device[] | null,
          });
          satisfiedEventsRef.current.add('selectedDevices');
          break;
        case 'selectedDashboardDateRange':
          dispatch({
            type: 'SELECTED_DASHBOARD_DATE_RANGE',
            payload: payload as DateRange | null,
          });
          satisfiedEventsRef.current.add('selectedDashboardDateRange');
          break;
        case 'selectedDashboardObject':
          dispatch({
            type: 'SELECTED_DASHBOARD_OBJECT',
            payload: payload as DashboardObject | null,
          });
          satisfiedEventsRef.current.add('selectedDashboardObject');
          break;
        case 'selectedDeviceObject':
          dispatch({
            type: 'SELECTED_DEVICE_OBJECT',
            payload: payload as DeviceObject | null,
          });
          satisfiedEventsRef.current.add('selectedDeviceObject');
          break;
        case 'isRealTimeActive':
          dispatch({
            type: 'REAL_TIME_STATUS',
            payload: payload as boolean | null,
          });
          satisfiedEventsRef.current.add('isRealTimeActive');
          break;
      }

      // Ready logic
      if (!readyRef.current) {
        const ok = readyEvents.every(e => satisfiedEventsRef.current.has(e));
        if (ok) {
          readyRef.current = true;
          dispatch({ type: 'SET_READY', payload: true });
          onReady?.();
        }
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOriginValid, onReady, readyEvents]);

  const actions = useMemo<OutboundActions>(() => {
    function post(event: string, payload?: unknown) {
      if (typeof window !== 'undefined' && window.parent) {
        window.parent.postMessage({ event, payload }, '*');
      }
    }
    return {
      setDashboardDevice: (deviceId: string) =>
        post('setDashboardDevice', deviceId),
      setDashboardMultipleDevices: (deviceIds: string[]) =>
        post('setDashboardMultipleDevices', deviceIds),
      setDashboardDateRange: (range: DateRange) =>
        post('setDashboardDateRange', range),
      setRealTime: (rt: boolean) => post('setRealTime', rt),
      refreshDashboard: () => post('refreshDashboard'),
      openDrawer: (opts: { url: string; width: number }) =>
        post('openDrawer', { drawerInfo: opts, id: 'react-widget' }),
      setFullScreen: (setting: 'toggle' | 'enable' | 'disabled') =>
        post('setFullScreen', setting),
      getHeaders: (): Record<string, string> => {
        // derive headers based on available tokens
        if (state.jwtToken) {
          return {
            Authorization: `Bearer ${state.jwtToken}`,
            'Content-type': 'application/json',
          };
        }
        if (state.token) {
          return {
            'X-Auth-Token': state.token,
            'Content-type': 'application/json',
          };
        }
        return { 'Content-type': 'application/json' };
      },
    };
  }, [state.jwtToken, state.token]);

  const value = useMemo<UbidotsContextValue>(
    () => ({ state, actions }),
    [state, actions]
  );

  return (
    <UbidotsContext.Provider value={value}>{children}</UbidotsContext.Provider>
  );
}
