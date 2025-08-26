import { useUbidots } from './useUbidots';

export function useUbidotsToken() {
  return useUbidots().state.token;
}

export function useUbidotsJWT() {
  return useUbidots().state.jwtToken;
}

export function useUbidotsSelectedDevice() {
  return useUbidots().state.selectedDevice;
}

export function useUbidotsSelectedDevices() {
  return useUbidots().state.selectedDevices;
}

export function useUbidotsDashboardDateRange() {
  return useUbidots().state.dateRange;
}

export function useUbidotsRealTimeStatus() {
  return useUbidots().state.realTime;
}

export function useUbidotsDeviceObject() {
  return useUbidots().state.deviceObject;
}

export function useUbidotsDashboardObject() {
  return useUbidots().state.dashboardObject;
}

export function useUbidotsWidget() {
  return useUbidots().state.widget;
}
