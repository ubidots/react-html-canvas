import type { Dispatch } from 'react';
import type {
  UbidotsAction,
  Device,
  DateRange,
  DashboardObject,
  DeviceObject,
  ReadyEvent,
} from '@/types';
import { INBOUND_EVENTS, ACTION_TYPES } from './constants';

/**
 * Message handler function type
 */
type MessageHandler = (
  payload: unknown,
  dispatch: Dispatch<UbidotsAction>,
  satisfiedEventsRef: React.MutableRefObject<Set<ReadyEvent>>
) => void;

/**
 * Individual message handlers
 */
const messageHandlers: Record<string, MessageHandler> = {
  [INBOUND_EVENTS.RECEIVED_TOKEN]: (payload, dispatch, satisfiedEventsRef) => {
    dispatch({ type: ACTION_TYPES.RECEIVED_TOKEN, payload: payload as string });
    satisfiedEventsRef.current.add('receivedToken');
  },

  [INBOUND_EVENTS.RECEIVED_JWT_TOKEN]: (
    payload,
    dispatch,
    satisfiedEventsRef
  ) => {
    dispatch({
      type: ACTION_TYPES.RECEIVED_JWT_TOKEN,
      payload: payload as string,
    });
    satisfiedEventsRef.current.add('receivedJWTToken');
  },

  [INBOUND_EVENTS.SELECTED_DEVICE]: (payload, dispatch, satisfiedEventsRef) => {
    let validatedPayload: Device | null = null;
    if (typeof payload === 'string') {
      const firstDeviceId = payload.split(',')[0].trim();
      if (firstDeviceId) validatedPayload = { id: firstDeviceId };
    }

    dispatch({ type: ACTION_TYPES.SELECTED_DEVICE, payload: validatedPayload });
    satisfiedEventsRef.current.add('selectedDevice');
  },

  [INBOUND_EVENTS.SELECTED_DEVICES]: (
    payload,
    dispatch,
    satisfiedEventsRef
  ) => {
    dispatch({
      type: ACTION_TYPES.SELECTED_DEVICES,
      payload: payload as Device[] | null,
    });
    satisfiedEventsRef.current.add('selectedDevices');
  },

  [INBOUND_EVENTS.SELECTED_DASHBOARD_DATE_RANGE]: (
    payload,
    dispatch,
    satisfiedEventsRef
  ) => {
    dispatch({
      type: ACTION_TYPES.SELECTED_DASHBOARD_DATE_RANGE,
      payload: payload as DateRange | null,
    });
    satisfiedEventsRef.current.add('selectedDashboardDateRange');
  },

  [INBOUND_EVENTS.SELECTED_DASHBOARD_OBJECT]: (
    payload,
    dispatch,
    satisfiedEventsRef
  ) => {
    dispatch({
      type: ACTION_TYPES.SELECTED_DASHBOARD_OBJECT,
      payload: payload as DashboardObject | null,
    });
    satisfiedEventsRef.current.add('selectedDashboardObject');
  },

  [INBOUND_EVENTS.SELECTED_DEVICE_OBJECT]: (
    payload,
    dispatch,
    satisfiedEventsRef
  ) => {
    dispatch({
      type: ACTION_TYPES.SELECTED_DEVICE_OBJECT,
      payload: payload as DeviceObject | null,
    });
    satisfiedEventsRef.current.add('selectedDeviceObject');
  },

  [INBOUND_EVENTS.IS_REAL_TIME_ACTIVE]: (
    payload,
    dispatch,
    satisfiedEventsRef
  ) => {
    dispatch({
      type: ACTION_TYPES.REAL_TIME_STATUS,
      payload: payload as boolean | null,
    });
    satisfiedEventsRef.current.add('isRealTimeActive');
  },
};

/**
 * Main message handler that uses object mapping instead of switch
 */
export function handleInboundMessage(
  event: string,
  payload: unknown,
  dispatch: Dispatch<UbidotsAction>,
  satisfiedEventsRef: React.MutableRefObject<Set<ReadyEvent>>
): void {
  const handler = messageHandlers[event];
  if (handler) {
    handler(payload, dispatch, satisfiedEventsRef);
  }
}

/**
 * Check if all required events are satisfied and update ready state
 */
export function checkReadyState(
  readyEvents: ReadyEvent[],
  satisfiedEventsRef: React.MutableRefObject<Set<ReadyEvent>>,
  readyRef: React.MutableRefObject<boolean>,
  dispatch: Dispatch<UbidotsAction>,
  onReady?: () => void
): void {
  if (!readyRef.current) {
    const allEventsSatisfied = readyEvents.every(e =>
      satisfiedEventsRef.current.has(e)
    );
    if (allEventsSatisfied) {
      readyRef.current = true;
      dispatch({ type: ACTION_TYPES.SET_READY, payload: true });
      onReady?.();
    }
  }
}
