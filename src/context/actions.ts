import type { DateRange, OutboundActions } from '@/types';
import { OUTBOUND_EVENTS, OUTBOUND_EVENTS_V2 } from './constants';

/**
 * Post message to parent window
 */
function postMessage(event: string, payload?: unknown): void {
  if (typeof window !== 'undefined' && window.parent) {
    window.parent.postMessage({ event, payload }, '*');
  }
}

/**
 * Post both V1 and V2 events to parent window
 */
function postMessageWithV2(
  eventV1: string,
  eventV2: string,
  payload?: unknown
): void {
  postMessage(eventV1, payload);
  postMessage(eventV2, payload);
}

/**
 * Generate authentication headers based on available tokens
 */
function generateHeaders(
  jwtToken: string | null,
  token: string | null
): Record<string, string> {
  if (jwtToken) {
    return {
      Authorization: `Bearer ${jwtToken}`,
      'Content-type': 'application/json',
    };
  }
  if (token) {
    return {
      'X-Auth-Token': token,
      'Content-type': 'application/json',
    };
  }
  return { 'Content-type': 'application/json' };
}

/**
 * Validate date range to ensure startTime is before endTime
 */
function validateDateRange(range: DateRange): boolean {
  if (!range || typeof range !== 'object') {
    console.error(
      '[setDashboardDateRange] Invalid date range: must be an object'
    );
    return false;
  }

  const { startTime, endTime } = range;

  if (typeof startTime !== 'number' || typeof endTime !== 'number') {
    console.error(
      '[setDashboardDateRange] Invalid date range: startTime and endTime must be numbers'
    );
    return false;
  }

  if (startTime >= endTime) {
    console.error(
      `[setDashboardDateRange] Invalid date range: startTime (${new Date(startTime).toISOString()}) must be before endTime (${new Date(endTime).toISOString()})`
    );
    return false;
  }

  return true;
}

/**
 * Action creators that don't depend on session-specific values.
 * Each action emits both V1 and V2 events for backward compatibility.
 * openDrawer requires widgetId and lives in createActions instead.
 */
const actionCreators = {
  setDashboardDevice: (deviceId: string) => {
    // V1: single id string  |  V2: array of device objects
    postMessage(OUTBOUND_EVENTS.SET_DASHBOARD_DEVICE, deviceId);
    postMessage(OUTBOUND_EVENTS_V2.SET_DASHBOARD_DEVICE, [{ id: deviceId }]);
  },

  setDashboardMultipleDevices: (deviceIds: string[]) => {
    // V1: string array  |  V2: array of device objects
    const devices = deviceIds.map(id => ({ id }));
    postMessage(OUTBOUND_EVENTS.SET_DASHBOARD_MULTIPLE_DEVICES, deviceIds);
    postMessage(OUTBOUND_EVENTS_V2.SET_DASHBOARD_MULTIPLE_DEVICES, devices);
  },

  setDashboardDateRange: (range: DateRange) => {
    if (!validateDateRange(range)) return;
    postMessageWithV2(
      OUTBOUND_EVENTS.SET_DASHBOARD_DATE_RANGE,
      OUTBOUND_EVENTS_V2.SET_DASHBOARD_DATE_RANGE,
      range
    );
  },

  setDashboardLayer: (layerId: string) => {
    // V2 protocol has no equivalent for layer yet — only V1 is sent.
    postMessage(OUTBOUND_EVENTS.SET_DASHBOARD_LAYER, layerId);
  },

  setRealTime: (rt: boolean) =>
    postMessageWithV2(
      OUTBOUND_EVENTS.SET_REAL_TIME,
      OUTBOUND_EVENTS_V2.SET_REAL_TIME,
      rt
    ),

  refreshDashboard: () =>
    postMessageWithV2(
      OUTBOUND_EVENTS.REFRESH_DASHBOARD,
      OUTBOUND_EVENTS_V2.REFRESH_DASHBOARD
    ),

  setFullScreen: (setting: 'toggle' | 'enable' | 'disable') =>
    postMessageWithV2(
      OUTBOUND_EVENTS.SET_FULL_SCREEN,
      OUTBOUND_EVENTS_V2.SET_FULL_SCREEN,
      setting
    ),
};

/**
 * Create actions object with header generation.
 * openDrawer is defined here (not in actionCreators) so it can close over
 * widgetId from context state instead of reading from window globals.
 */
export function createActions(
  jwtToken: string | null,
  token: string | null,
  widgetId: string | null
): OutboundActions {
  return {
    ...actionCreators,
    openDrawer: (opts: { url: string; width: number }) => {
      const payload = { drawerInfo: opts, id: widgetId ?? 'react-widget' };
      postMessageWithV2(
        OUTBOUND_EVENTS.OPEN_DRAWER,
        OUTBOUND_EVENTS_V2.OPEN_DRAWER,
        payload
      );
    },
    getHeaders: () => generateHeaders(jwtToken, token),
  };
}
