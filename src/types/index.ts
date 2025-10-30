export type ReadyEvent =
  | 'receivedToken'
  | 'receivedJWTToken'
  | 'selectedDevice'
  | 'selectedDevices'
  | 'selectedDashboardDateRange'
  | 'selectedDashboardObject'
  | 'selectedDeviceObject'
  | 'isRealTimeActive';

export interface Device {
  id: string;
  name?: string;
  label?: string;
  description?: string;
  [k: string]: unknown;
}

export interface DateRange {
  startTime: number;
  endTime: number;
}

export interface DashboardObject {
  id?: string;
  name?: string;
  [k: string]: unknown;
}

export interface DeviceObject {
  id?: string;
  name?: string;
  label?: string;
  [k: string]: unknown;
}

export interface WidgetInfo {
  id?: string;
  settings?: Record<string, unknown>;
}

export interface UbidotsState {
  ready: boolean;
  token: string | null;
  jwtToken: string | null;
  selectedDevice: Device | null;
  selectedDevices: Device[] | null;
  dateRange: DateRange | null;
  dashboardObject: DashboardObject | null;
  deviceObject: DeviceObject | null;
  realTime: boolean | null;
  widget: WidgetInfo | null;
}

export type UbidotsAction =
  | { type: 'RECEIVED_TOKEN'; payload: string }
  | { type: 'RECEIVED_JWT_TOKEN'; payload: string }
  | { type: 'SELECTED_DEVICE'; payload: Device | null }
  | { type: 'SELECTED_DEVICES'; payload: Device[] | null }
  | { type: 'SELECTED_DASHBOARD_DATE_RANGE'; payload: DateRange | null }
  | { type: 'SELECTED_DASHBOARD_OBJECT'; payload: DashboardObject | null }
  | { type: 'SELECTED_DEVICE_OBJECT'; payload: DeviceObject | null }
  | { type: 'REAL_TIME_STATUS'; payload: boolean | null }
  | { type: 'SET_READY'; payload: boolean }
  | { type: 'SET_WIDGET'; payload: WidgetInfo | null };

export interface OutboundActions {
  setDashboardDevice: (deviceId: string) => void;
  setDashboardMultipleDevices: (deviceIds: string[]) => void;
  setDashboardDateRange: (range: DateRange) => void;
  setRealTime: (rt: boolean) => void;
  refreshDashboard: () => void;
  openDrawer: (opts: { url: string; width: number }) => void;
  setFullScreen: (setting: 'toggle' | 'enable' | 'disable') => void;
  getHeaders: () => Record<string, string>;
}

export type UbidotsActions = OutboundActions;
