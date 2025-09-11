import { useUbidots } from '../context/ubidots';

export function useUbidotsToken() {
  const { state } = useUbidots();
  return state.token;
}

export function useUbidotsJWT() {
  const { state } = useUbidots();
  return state.jwtToken;
}

export function useUbidotsSelectedDevice() {
  const { state } = useUbidots();
  return state.selectedDevice;
}

export function useUbidotsSelectedDevices() {
  const { state } = useUbidots();
  return state.selectedDevices;
}

export function useUbidotsDashboardDateRange() {
  const { state } = useUbidots();
  return state.dateRange;
}

export function useUbidotsRealTimeStatus() {
  const { state } = useUbidots();
  return state.realTime;
}

export function useUbidotsDeviceObject() {
  const { state } = useUbidots();
  return state.deviceObject;
}

export function useUbidotsDashboardObject() {
  const { state } = useUbidots();
  return state.dashboardObject;
}

export function useUbidotsWidget() {
  const { state } = useUbidots();
  return state.widget;
}
