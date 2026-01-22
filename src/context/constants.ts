/**
 * Event constants for Ubidots communication
 */

import type { ReadyEvent } from '@/types';

// ==================== V1 Events (Legacy) ====================

export const INBOUND_EVENTS = {
  RECEIVED_TOKEN: 'receivedToken',
  RECEIVED_JWT_TOKEN: 'receivedJWTToken',
  SELECTED_DEVICE: 'selectedDevice',
  SELECTED_DEVICES: 'selectedDevices',
  SELECTED_DASHBOARD_DATE_RANGE: 'selectedDashboardDateRange',
  SELECTED_DASHBOARD_OBJECT: 'selectedDashboardObject',
  SELECTED_DEVICE_OBJECT: 'selectedDeviceObject',
  SELECTED_DEVICE_OBJECTS: 'selectedDeviceObjects',
  SELECTED_FILTERS: 'selectedFilters',
  IS_REAL_TIME_ACTIVE: 'isRealTimeActive',
} as const;

export const OUTBOUND_EVENTS = {
  SET_DASHBOARD_DEVICE: 'setDashboardDevice',
  SET_DASHBOARD_MULTIPLE_DEVICES: 'setDashboardMultipleDevices',
  SET_DASHBOARD_DATE_RANGE: 'setDashboardDateRange',
  SET_DASHBOARD_LAYER: 'setDashboardLayer',
  SET_REAL_TIME: 'setRealTime',
  REFRESH_DASHBOARD: 'refreshDashboard',
  OPEN_DRAWER: 'openDrawer',
  SET_FULL_SCREEN: 'setFullScreen',
} as const;

// ==================== V2 Events ====================

export const INBOUND_EVENTS_V2 = {
  // Auth Events
  TOKEN: 'v2:auth:token',
  JWT: 'v2:auth:jwt',

  // Dashboard Events
  DEVICES_ALL: 'v2:dashboard:devices:self',
  SELECTED_DEVICES: 'v2:dashboard:devices:selected',
  SELECTED_DATE_RANGE: 'v2:dashboard:settings:daterange',
  REFRESH_DASHBOARD: 'v2:dashboard:settings:refreshed',
  REALTIME_ACTIVE: 'v2:dashboard:settings:rt',
  SELECTED_DASHBOARD_OBJECT: 'v2:dashboard:self',
  SELECTED_FILTERS: 'v2:dashboard:settings:filters',
} as const;

export const OUTBOUND_EVENTS_V2 = {
  // Dashboard Events
  SET_DASHBOARD_DEVICE: 'v2:dashboard:devices:selected',
  SET_DASHBOARD_MULTIPLE_DEVICES: 'v2:dashboard:devices:selected',
  SET_DASHBOARD_DATE_RANGE: 'v2:dashboard:settings:daterange',
  SET_REAL_TIME: 'v2:dashboard:settings:rt',
  REFRESH_DASHBOARD: 'v2:dashboard:settings:refreshed',
  SET_FULL_SCREEN: 'v2:dashboard:settings:fullscreen',
  OPEN_DRAWER: 'v2:dashboard:drawer:open',
} as const;

export const ACTION_TYPES = {
  RECEIVED_TOKEN: 'RECEIVED_TOKEN',
  RECEIVED_JWT_TOKEN: 'RECEIVED_JWT_TOKEN',
  SELECTED_DEVICE: 'SELECTED_DEVICE',
  SELECTED_DEVICES: 'SELECTED_DEVICES',
  SELECTED_DASHBOARD_DATE_RANGE: 'SELECTED_DASHBOARD_DATE_RANGE',
  SELECTED_DASHBOARD_OBJECT: 'SELECTED_DASHBOARD_OBJECT',
  SELECTED_DEVICE_OBJECT: 'SELECTED_DEVICE_OBJECT',
  SELECTED_DEVICE_OBJECTS: 'SELECTED_DEVICE_OBJECTS',
  SELECTED_FILTERS: 'SELECTED_FILTERS',
  REAL_TIME_STATUS: 'REAL_TIME_STATUS',
  SET_READY: 'SET_READY',
  SET_WIDGET: 'SET_WIDGET',
  SET_WIDGET_ID: 'SET_WIDGET_ID',
} as const;

export const DEFAULT_READY_EVENTS: ReadyEvent[] = ['receivedToken'];
