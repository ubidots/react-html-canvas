import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createActions } from '../actions';
import { OUTBOUND_EVENTS, OUTBOUND_EVENTS_V2 } from '../constants';

describe('actions', () => {
  let postMessageSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    postMessageSpy = vi.spyOn(window.parent, 'postMessage');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    postMessageSpy.mockRestore();
    vi.restoreAllMocks();
    // Clean up widgetId from window
    delete (window as unknown as Record<string, unknown>).widgetId;
  });

  describe('setDashboardDevice', () => {
    it('should emit both V1 and V2 events', () => {
      const actions = createActions(null, 'token');

      actions.setDashboardDevice('device-123');

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.SET_DASHBOARD_DEVICE, payload: 'device-123' },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          event: OUTBOUND_EVENTS_V2.SET_DASHBOARD_DEVICE,
          payload: [{ id: 'device-123' }],
        },
        '*'
      );
    });

    it('should convert single device ID to array format for V2', () => {
      const actions = createActions(null, 'token');

      actions.setDashboardDevice('my-device');

      const v2Call = postMessageSpy.mock.calls.find(
        call =>
          (call[0] as { event: string }).event ===
          OUTBOUND_EVENTS_V2.SET_DASHBOARD_DEVICE
      );
      expect((v2Call![0] as { payload: unknown }).payload).toEqual([
        { id: 'my-device' },
      ]);
    });
  });

  describe('setDashboardMultipleDevices', () => {
    it('should emit both V1 and V2 events', () => {
      const actions = createActions(null, 'token');

      actions.setDashboardMultipleDevices(['dev1', 'dev2', 'dev3']);

      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          event: OUTBOUND_EVENTS.SET_DASHBOARD_MULTIPLE_DEVICES,
          payload: ['dev1', 'dev2', 'dev3'],
        },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          event: OUTBOUND_EVENTS_V2.SET_DASHBOARD_MULTIPLE_DEVICES,
          payload: [{ id: 'dev1' }, { id: 'dev2' }, { id: 'dev3' }],
        },
        '*'
      );
    });

    it('should convert string array to Device array for V2', () => {
      const actions = createActions(null, 'token');

      actions.setDashboardMultipleDevices(['a', 'b']);

      const v2Call = postMessageSpy.mock.calls.find(
        call =>
          (call[0] as { event: string }).event ===
          OUTBOUND_EVENTS_V2.SET_DASHBOARD_MULTIPLE_DEVICES
      );
      expect((v2Call![0] as { payload: unknown }).payload).toEqual([
        { id: 'a' },
        { id: 'b' },
      ]);
    });
  });

  describe('setDashboardDateRange', () => {
    it('should emit both V1 and V2 events for valid date range', () => {
      const actions = createActions(null, 'token');
      const dateRange = { startTime: 1000, endTime: 2000 };

      actions.setDashboardDateRange(dateRange);

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.SET_DASHBOARD_DATE_RANGE, payload: dateRange },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          event: OUTBOUND_EVENTS_V2.SET_DASHBOARD_DATE_RANGE,
          payload: dateRange,
        },
        '*'
      );
    });

    it('should NOT emit events for invalid date range (startTime >= endTime)', () => {
      const actions = createActions(null, 'token');
      const invalidRange = { startTime: 2000, endTime: 1000 };

      actions.setDashboardDateRange(invalidRange);

      expect(postMessageSpy).not.toHaveBeenCalled();
    });

    it('should NOT emit events for null date range', () => {
      const actions = createActions(null, 'token');

      actions.setDashboardDateRange(
        null as unknown as { startTime: number; endTime: number }
      );

      expect(postMessageSpy).not.toHaveBeenCalled();
    });
  });

  describe('setDashboardLayer', () => {
    it('should only emit V1 event (no V2 equivalent)', () => {
      const actions = createActions(null, 'token');

      actions.setDashboardLayer('layer-1');

      expect(postMessageSpy).toHaveBeenCalledTimes(1);
      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.SET_DASHBOARD_LAYER, payload: 'layer-1' },
        '*'
      );
    });
  });

  describe('setRealTime', () => {
    it('should emit both V1 and V2 events with true', () => {
      const actions = createActions(null, 'token');

      actions.setRealTime(true);

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.SET_REAL_TIME, payload: true },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS_V2.SET_REAL_TIME, payload: true },
        '*'
      );
    });

    it('should emit both V1 and V2 events with false', () => {
      const actions = createActions(null, 'token');

      actions.setRealTime(false);

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.SET_REAL_TIME, payload: false },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS_V2.SET_REAL_TIME, payload: false },
        '*'
      );
    });
  });

  describe('refreshDashboard', () => {
    it('should emit both V1 and V2 events without payload', () => {
      const actions = createActions(null, 'token');

      actions.refreshDashboard();

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.REFRESH_DASHBOARD, payload: undefined },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS_V2.REFRESH_DASHBOARD, payload: undefined },
        '*'
      );
    });
  });

  describe('openDrawer', () => {
    it('should emit both V1 and V2 events with drawer info', () => {
      const actions = createActions(null, 'token');
      const drawerOpts = { url: 'https://example.com', width: 400 };

      actions.openDrawer(drawerOpts);

      // When widgetId is not set on window, it will be undefined
      const expectedPayload = {
        drawerInfo: drawerOpts,
        id: undefined,
      };

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.OPEN_DRAWER, payload: expectedPayload },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS_V2.OPEN_DRAWER, payload: expectedPayload },
        '*'
      );
    });

    it('should use widgetId from window if available', () => {
      (window as unknown as Record<string, unknown>).widgetId =
        'custom-widget-id';
      const actions = createActions(null, 'token');
      const drawerOpts = { url: 'https://example.com', width: 300 };

      actions.openDrawer(drawerOpts);

      const expectedPayload = {
        drawerInfo: drawerOpts,
        id: 'custom-widget-id',
      };

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.OPEN_DRAWER, payload: expectedPayload },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS_V2.OPEN_DRAWER, payload: expectedPayload },
        '*'
      );
    });
  });

  describe('setFullScreen', () => {
    it('should emit both V1 and V2 events with toggle', () => {
      const actions = createActions(null, 'token');

      actions.setFullScreen('toggle');

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.SET_FULL_SCREEN, payload: 'toggle' },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS_V2.SET_FULL_SCREEN, payload: 'toggle' },
        '*'
      );
    });

    it('should emit both V1 and V2 events with enable', () => {
      const actions = createActions(null, 'token');

      actions.setFullScreen('enable');

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.SET_FULL_SCREEN, payload: 'enable' },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS_V2.SET_FULL_SCREEN, payload: 'enable' },
        '*'
      );
    });

    it('should emit both V1 and V2 events with disable', () => {
      const actions = createActions(null, 'token');

      actions.setFullScreen('disable');

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS.SET_FULL_SCREEN, payload: 'disable' },
        '*'
      );
      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: OUTBOUND_EVENTS_V2.SET_FULL_SCREEN, payload: 'disable' },
        '*'
      );
    });
  });

  describe('getHeaders', () => {
    it('should return JWT Bearer header when jwtToken is provided', () => {
      const actions = createActions('jwt-token-123', null);

      const headers = actions.getHeaders();

      expect(headers).toEqual({
        Authorization: 'Bearer jwt-token-123',
        'Content-type': 'application/json',
      });
    });

    it('should return X-Auth-Token header when only token is provided', () => {
      const actions = createActions(null, 'api-token-456');

      const headers = actions.getHeaders();

      expect(headers).toEqual({
        'X-Auth-Token': 'api-token-456',
        'Content-type': 'application/json',
      });
    });

    it('should prefer JWT token over API token', () => {
      const actions = createActions('jwt-token', 'api-token');

      const headers = actions.getHeaders();

      expect(headers).toEqual({
        Authorization: 'Bearer jwt-token',
        'Content-type': 'application/json',
      });
    });

    it('should return only Content-type when no tokens are provided', () => {
      const actions = createActions(null, null);

      const headers = actions.getHeaders();

      expect(headers).toEqual({
        'Content-type': 'application/json',
      });
    });
  });
});
