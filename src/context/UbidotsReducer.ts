import type { UbidotsAction, UbidotsState } from '@/types';

export const initialState: UbidotsState = {
  ready: false,
  token: null,
  jwtToken: null,
  selectedDevice: null,
  selectedDevices: null,
  dateRange: null,
  dashboardObject: null,
  deviceObject: null,
  realTime: null,
  widget: null,
};

export function ubidotsReducer(
  state: UbidotsState,
  action: UbidotsAction
): UbidotsState {
  switch (action.type) {
    case 'RECEIVED_TOKEN':
      return { ...state, token: action.payload };
    case 'RECEIVED_JWT_TOKEN':
      return { ...state, jwtToken: action.payload };
    case 'SELECTED_DEVICE':
      return { ...state, selectedDevice: action.payload };
    case 'SELECTED_DEVICES':
      return { ...state, selectedDevices: action.payload };
    case 'SELECTED_DASHBOARD_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SELECTED_DASHBOARD_OBJECT':
      return { ...state, dashboardObject: action.payload };
    case 'SELECTED_DEVICE_OBJECT':
      return { ...state, deviceObject: action.payload };
    case 'REAL_TIME_STATUS':
      return { ...state, realTime: action.payload };
    case 'SET_READY':
      return { ...state, ready: action.payload };
    case 'SET_WIDGET':
      return { ...state, widget: action.payload };
    default:
      return state;
  }
}
