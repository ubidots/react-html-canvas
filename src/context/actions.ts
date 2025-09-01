import type { DateRange, OutboundActions } from '@/types';
import { OUTBOUND_EVENTS } from './constants';

/**
 * Post message to parent window
 */
function postMessage(event: string, payload?: unknown): void {
  if (typeof window !== 'undefined' && window.parent) {
    window.parent.postMessage({ event, payload }, '*');
  }
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
 * Action creators using object mapping
 */
const actionCreators = {
  setDashboardDevice: (deviceId: string) =>
    postMessage(OUTBOUND_EVENTS.SET_DASHBOARD_DEVICE, deviceId),

  setDashboardMultipleDevices: (deviceIds: string[]) =>
    postMessage(OUTBOUND_EVENTS.SET_DASHBOARD_MULTIPLE_DEVICES, deviceIds),

  setDashboardDateRange: (range: DateRange) =>
    postMessage(OUTBOUND_EVENTS.SET_DASHBOARD_DATE_RANGE, range),

  setRealTime: (rt: boolean) => postMessage(OUTBOUND_EVENTS.SET_REAL_TIME, rt),

  refreshDashboard: () => postMessage(OUTBOUND_EVENTS.REFRESH_DASHBOARD),

  openDrawer: (opts: { url: string; width: number }) =>
    postMessage(OUTBOUND_EVENTS.OPEN_DRAWER, {
      drawerInfo: opts,
      id: 'react-widget',
    }),

  setFullScreen: (setting: 'toggle' | 'enable' | 'disabled') =>
    postMessage(OUTBOUND_EVENTS.SET_FULL_SCREEN, setting),
};

/**
 * Create actions object with header generation
 */
export function createActions(
  jwtToken: string | null,
  token: string | null
): OutboundActions {
  return {
    ...actionCreators,
    getHeaders: () => generateHeaders(jwtToken, token),
  };
}
