import type {
  UbidotsAction,
  UbidotsState,
  Device,
  DateRange,
  DashboardObject,
  DeviceObject,
  WidgetInfo,
} from '@/types';
import { ACTION_TYPES } from './constants';

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

/**
 * Reducer handlers using object mapping instead of switch
 */
const reducerHandlers: Record<
  string,
  (state: UbidotsState, action: UbidotsAction) => UbidotsState
> = {
  [ACTION_TYPES.RECEIVED_TOKEN]: (state, action) => ({
    ...state,
    token: action.payload as string | null,
  }),
  [ACTION_TYPES.RECEIVED_JWT_TOKEN]: (state, action) => ({
    ...state,
    jwtToken: action.payload as string | null,
  }),
  [ACTION_TYPES.SELECTED_DEVICE]: (state, action) => ({
    ...state,
    selectedDevice: action.payload as Device | null,
  }),
  [ACTION_TYPES.SELECTED_DEVICES]: (state, action) => ({
    ...state,
    selectedDevices: action.payload as Device[] | null,
  }),
  [ACTION_TYPES.SELECTED_DASHBOARD_DATE_RANGE]: (state, action) => ({
    ...state,
    dateRange: action.payload as DateRange | null,
  }),
  [ACTION_TYPES.SELECTED_DASHBOARD_OBJECT]: (state, action) => ({
    ...state,
    dashboardObject: action.payload as DashboardObject | null,
  }),
  [ACTION_TYPES.SELECTED_DEVICE_OBJECT]: (state, action) => ({
    ...state,
    deviceObject: action.payload as DeviceObject | null,
  }),
  [ACTION_TYPES.REAL_TIME_STATUS]: (state, action) => ({
    ...state,
    realTime: action.payload as boolean | null,
  }),
  [ACTION_TYPES.SET_READY]: (state, action) => ({
    ...state,
    ready: action.payload as boolean,
  }),
  [ACTION_TYPES.SET_WIDGET]: (state, action) => ({
    ...state,
    widget: action.payload as WidgetInfo | null,
  }),
};

export function ubidotsReducer(
  state: UbidotsState,
  action: UbidotsAction
): UbidotsState {
  const handler = reducerHandlers[action.type];
  return handler ? handler(state, action) : state;
}
