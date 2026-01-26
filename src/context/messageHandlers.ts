import type { Dispatch } from 'react';
import type {
  UbidotsAction,
  UbidotsState,
  Device,
  DateRange,
  DashboardObject,
  DeviceObject,
  FilterValue,
  ReadyEvent,
} from '@/types';
import { INBOUND_EVENTS, INBOUND_EVENTS_V2, ACTION_TYPES } from './constants';

/**
 * Post V2 event to parent window
 * This is used to emit V2 events when V1 events are processed
 */
function emitV2Event(event: string, payload?: unknown): void {
  if (typeof window !== 'undefined' && window.parent) {
    window.parent.postMessage({ event, payload }, '*');
  }
}

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
  // ==================== V1 Auth Events ====================
  [INBOUND_EVENTS.RECEIVED_TOKEN]: (payload, dispatch, satisfiedEventsRef) => {
    dispatch({ type: ACTION_TYPES.RECEIVED_TOKEN, payload: payload as string });
    satisfiedEventsRef.current.add('receivedToken');
    // Emit V2 event
    emitV2Event(INBOUND_EVENTS_V2.TOKEN, payload);
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
    // Emit V2 event
    emitV2Event(INBOUND_EVENTS_V2.JWT, payload);
  },

  // ==================== V1 Dashboard Events ====================
  [INBOUND_EVENTS.SELECTED_DEVICE]: (payload, dispatch, satisfiedEventsRef) => {
    let validatedPayload: Device | null = null;
    if (typeof payload === 'string') {
      const firstDeviceId = payload.split(',')[0].trim();
      if (firstDeviceId) validatedPayload = { id: firstDeviceId };
    }

    dispatch({ type: ACTION_TYPES.SELECTED_DEVICE, payload: validatedPayload });
    satisfiedEventsRef.current.add('selectedDevice');
    // Emit V2 event - convert single device to array format
    if (validatedPayload) {
      emitV2Event(INBOUND_EVENTS_V2.SELECTED_DEVICES, [validatedPayload]);
    }
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
    // Emit V2 event
    emitV2Event(INBOUND_EVENTS_V2.SELECTED_DEVICES, payload);
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
    // Emit V2 event
    emitV2Event(INBOUND_EVENTS_V2.SELECTED_DATE_RANGE, payload);
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
    // Emit V2 event
    emitV2Event(INBOUND_EVENTS_V2.SELECTED_DASHBOARD_OBJECT, payload);
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
    // Note: No V2 equivalent for SELECTED_DEVICE_OBJECT
  },

  [INBOUND_EVENTS.SELECTED_DEVICE_OBJECTS]: (
    payload,
    dispatch,
    satisfiedEventsRef
  ) => {
    dispatch({
      type: ACTION_TYPES.SELECTED_DEVICE_OBJECTS,
      payload: payload as DeviceObject[] | null,
    });
    satisfiedEventsRef.current.add('selectedDeviceObjects');
    // Note: No V2 equivalent for SELECTED_DEVICE_OBJECTS
  },

  [INBOUND_EVENTS.SELECTED_FILTERS]: (
    payload,
    dispatch,
    satisfiedEventsRef
  ) => {
    dispatch({
      type: ACTION_TYPES.SELECTED_FILTERS,
      payload: payload as FilterValue[] | null,
    });
    satisfiedEventsRef.current.add('selectedFilters');
    // Emit V2 event
    emitV2Event(INBOUND_EVENTS_V2.SELECTED_FILTERS, payload);
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
    // Emit V2 event
    emitV2Event(INBOUND_EVENTS_V2.REALTIME_ACTIVE, payload);
  },

  // ==================== V2 Events (direct handlers) ====================
  // These allow the system to also receive V2 events directly
  [INBOUND_EVENTS_V2.TOKEN]: (payload, dispatch, satisfiedEventsRef) => {
    dispatch({ type: ACTION_TYPES.RECEIVED_TOKEN, payload: payload as string });
    satisfiedEventsRef.current.add('receivedToken');
  },

  [INBOUND_EVENTS_V2.JWT]: (payload, dispatch, satisfiedEventsRef) => {
    dispatch({
      type: ACTION_TYPES.RECEIVED_JWT_TOKEN,
      payload: payload as string,
    });
    satisfiedEventsRef.current.add('receivedJWTToken');
  },

  [INBOUND_EVENTS_V2.SELECTED_DEVICES]: (
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

  [INBOUND_EVENTS_V2.SELECTED_DATE_RANGE]: (
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

  [INBOUND_EVENTS_V2.SELECTED_DASHBOARD_OBJECT]: (
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

  [INBOUND_EVENTS_V2.SELECTED_FILTERS]: (
    payload,
    dispatch,
    satisfiedEventsRef
  ) => {
    dispatch({
      type: ACTION_TYPES.SELECTED_FILTERS,
      payload: payload as FilterValue[] | null,
    });
    satisfiedEventsRef.current.add('selectedFilters');
  },

  [INBOUND_EVENTS_V2.REALTIME_ACTIVE]: (
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
 * Check if the state has all required values defined (for public dashboards)
 * This mimics the vanilla JS library behavior where ready state is determined
 * by checking if certain state values are defined, not just by events.
 */
function checkStateValuesReady(state: UbidotsState): boolean {
  const hasToken = state.token !== null || state.jwtToken !== null;
  const hasDevice = state.selectedDevice !== null;
  const hasDateRange = state.dateRange !== null;
  const hasDashboardObject = state.dashboardObject !== null;
  return hasToken && hasDevice && hasDateRange && hasDashboardObject;
}

/**
 * Check if all required events are satisfied and update ready state
 *
 * This function checks two conditions:
 * 1. All required events from readyEvents array have been satisfied
 * 2. OR the state has all required values defined (for public dashboards)
 */
export function checkReadyState(
  readyEvents: ReadyEvent[],
  satisfiedEventsRef: React.MutableRefObject<Set<ReadyEvent>>,
  readyRef: React.MutableRefObject<boolean>,
  dispatch: Dispatch<UbidotsAction>,
  state: UbidotsState,
  onReady?: () => void
): void {
  if (!readyRef.current) {
    const allEventsSatisfied = readyEvents.every(e =>
      satisfiedEventsRef.current.has(e)
    );

    const stateValuesReady = checkStateValuesReady(state);
    if (allEventsSatisfied || stateValuesReady) {
      readyRef.current = true;
      dispatch({ type: ACTION_TYPES.SET_READY, payload: true });
      onReady?.();
    }
  }
}
