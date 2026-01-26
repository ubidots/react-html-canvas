import { describe, it, expect } from 'vitest';
import { ubidotsReducer, initialState } from '../UbidotsReducer';

describe('ubidotsReducer', () => {
  it('should handle token events', () => {
    const s1 = ubidotsReducer(initialState, {
      type: 'RECEIVED_TOKEN',
      payload: 't',
    });
    expect(s1.token).toBe('t');
    const s2 = ubidotsReducer(s1, {
      type: 'RECEIVED_JWT_TOKEN',
      payload: 'jwt',
    });
    expect(s2.jwtToken).toBe('jwt');
  });

  it('should handle selections and date range', () => {
    const s1 = ubidotsReducer(initialState, {
      type: 'SELECTED_DEVICE',
      payload: { id: 'd1' },
    });
    expect(s1.selectedDevice?.id).toBe('d1');
    const s2 = ubidotsReducer(s1, {
      type: 'SELECTED_DEVICES',
      payload: [{ id: 'd2' }],
    });
    expect(s2.selectedDevices?.[0].id).toBe('d2');
    const s3 = ubidotsReducer(s2, {
      type: 'SELECTED_DASHBOARD_DATE_RANGE',
      payload: { startTime: 1, endTime: 2 },
    });
    expect(s3.dateRange?.startTime).toBe(1);
  });

  it('should handle ready and real-time', () => {
    const s1 = ubidotsReducer(initialState, {
      type: 'REAL_TIME_STATUS',
      payload: true,
    });
    expect(s1.realTime).toBe(true);
    const s2 = ubidotsReducer(s1, { type: 'SET_READY', payload: true });
    expect(s2.ready).toBe(true);
  });

  it('should handle SET_WIDGET_ID action', () => {
    const s1 = ubidotsReducer(initialState, {
      type: 'SET_WIDGET_ID',
      payload: 'widget-123',
    });
    expect(s1.widgetId).toBe('widget-123');
  });

  it('should handle SET_WIDGET_ID with null payload', () => {
    const stateWithWidgetId = ubidotsReducer(initialState, {
      type: 'SET_WIDGET_ID',
      payload: 'widget-abc',
    });
    expect(stateWithWidgetId.widgetId).toBe('widget-abc');

    const s2 = ubidotsReducer(stateWithWidgetId, {
      type: 'SET_WIDGET_ID',
      payload: null,
    });
    expect(s2.widgetId).toBeNull();
  });

  it('should have widgetId as null in initial state', () => {
    expect(initialState.widgetId).toBeNull();
  });
});
