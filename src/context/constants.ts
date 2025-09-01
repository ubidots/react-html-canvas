/**
 * Event constants for Ubidots communication
 */

import type { ReadyEvent } from '@/types';

export const INBOUND_EVENTS = {
  RECEIVED_TOKEN: 'receivedToken',
  RECEIVED_JWT_TOKEN: 'receivedJWTToken',
  SELECTED_DEVICE: 'selectedDevice',
  SELECTED_DEVICES: 'selectedDevices',
  SELECTED_DASHBOARD_DATE_RANGE: 'selectedDashboardDateRange',
  SELECTED_DASHBOARD_OBJECT: 'selectedDashboardObject',
  SELECTED_DEVICE_OBJECT: 'selectedDeviceObject',
  IS_REAL_TIME_ACTIVE: 'isRealTimeActive',
} as const;

export const OUTBOUND_EVENTS = {
  SET_DASHBOARD_DEVICE: 'setDashboardDevice',
  SET_DASHBOARD_MULTIPLE_DEVICES: 'setDashboardMultipleDevices',
  SET_DASHBOARD_DATE_RANGE: 'setDashboardDateRange',
  SET_REAL_TIME: 'setRealTime',
  REFRESH_DASHBOARD: 'refreshDashboard',
  OPEN_DRAWER: 'openDrawer',
  SET_FULL_SCREEN: 'setFullScreen',
} as const;

export const ACTION_TYPES = {
  RECEIVED_TOKEN: 'RECEIVED_TOKEN',
  RECEIVED_JWT_TOKEN: 'RECEIVED_JWT_TOKEN',
  SELECTED_DEVICE: 'SELECTED_DEVICE',
  SELECTED_DEVICES: 'SELECTED_DEVICES',
  SELECTED_DASHBOARD_DATE_RANGE: 'SELECTED_DASHBOARD_DATE_RANGE',
  SELECTED_DASHBOARD_OBJECT: 'SELECTED_DASHBOARD_OBJECT',
  SELECTED_DEVICE_OBJECT: 'SELECTED_DEVICE_OBJECT',
  REAL_TIME_STATUS: 'REAL_TIME_STATUS',
  SET_READY: 'SET_READY',
  SET_WIDGET: 'SET_WIDGET',
} as const;

export const DEFAULT_READY_EVENTS: ReadyEvent[] = ['receivedToken'];
