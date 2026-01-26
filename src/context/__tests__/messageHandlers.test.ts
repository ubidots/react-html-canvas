import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleInboundMessage } from '../messageHandlers';
import { INBOUND_EVENTS, INBOUND_EVENTS_V2 } from '../constants';
import type { ReadyEvent } from '@/types';

describe('messageHandlers', () => {
  describe('SELECTED_DEVICE handler', () => {
    it('should create a Device object when payload is a single device ID string', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      // Simulate what Ubidots sends in single-device dashboards
      const stringPayload = 'device-123';

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        stringPayload,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: { id: 'device-123' },
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });

    it('should return the first device when payload is a comma-separated string (multi-device dashboard)', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      // Simulate what Ubidots sends in multi-device dashboards
      const stringPayload = 'device-123,device-456,device-789';

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        stringPayload,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: { id: 'device-123' },
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });

    it('should trim whitespace from single device ID string', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      const stringPayload = '  device-123  ';

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        stringPayload,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: { id: 'device-123' },
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });

    it('should trim whitespace from first device in comma-separated string', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      const stringPayload = '  device-123  , device-456 , device-789  ';

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        stringPayload,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: { id: 'device-123' },
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });

    it('should return null when payload is null', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        null,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: null,
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });

    it('should return null when payload is undefined', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        undefined,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: null,
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });

    it('should return null when payload is an array', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      const arrayPayload = [{ id: 'device-123' }, { id: 'device-456' }];

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        arrayPayload,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: null,
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });

    it('should return null when payload is an object', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      const objectPayload = {
        id: 'device-123',
        name: 'Test Device',
      };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        objectPayload,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: null,
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });

    it('should return null when payload is a number', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        123,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: null,
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });

    it('should return null when payload is an empty string', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        '',
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: null,
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });

    it('should return null when payload is a string with only whitespace', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        '   ',
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICE',
        payload: null,
      });
      expect(satisfiedEventsRef.current.has('selectedDevice')).toBe(true);
    });
  });

  describe('SELECTED_DEVICES handler', () => {
    it('should accept a valid Device array', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      const validDevices = [
        { id: 'device-123', name: 'Device 1' },
        { id: 'device-456', name: 'Device 2' },
      ];

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICES,
        validDevices,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICES',
        payload: validDevices,
      });
      expect(satisfiedEventsRef.current.has('selectedDevices')).toBe(true);
    });

    it('should accept null payload', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICES,
        null,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICES',
        payload: null,
      });
      expect(satisfiedEventsRef.current.has('selectedDevices')).toBe(true);
    });
  });

  describe('RECEIVED_TOKEN handler', () => {
    it('should accept a valid token string', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = {
        current: new Set<ReadyEvent>(),
      };

      const token = 'test-token-123';

      handleInboundMessage(
        INBOUND_EVENTS.RECEIVED_TOKEN,
        token,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'RECEIVED_TOKEN',
        payload: token,
      });
      expect(satisfiedEventsRef.current.has('receivedToken')).toBe(true);
    });
  });

  describe('V2 Events emission from V1 handlers', () => {
    let postMessageSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      postMessageSpy = vi.spyOn(window.parent, 'postMessage');
    });

    afterEach(() => {
      postMessageSpy.mockRestore();
    });

    it('should emit v2:auth:token when receivedToken is processed', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };

      handleInboundMessage(
        INBOUND_EVENTS.RECEIVED_TOKEN,
        'test-token',
        dispatch,
        satisfiedEventsRef
      );

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: INBOUND_EVENTS_V2.TOKEN, payload: 'test-token' },
        '*'
      );
    });

    it('should emit v2:auth:jwt when receivedJWTToken is processed', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };

      handleInboundMessage(
        INBOUND_EVENTS.RECEIVED_JWT_TOKEN,
        'jwt-token',
        dispatch,
        satisfiedEventsRef
      );

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: INBOUND_EVENTS_V2.JWT, payload: 'jwt-token' },
        '*'
      );
    });

    it('should emit v2:dashboard:devices:selected when selectedDevice is processed', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        'device-123',
        dispatch,
        satisfiedEventsRef
      );

      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          event: INBOUND_EVENTS_V2.SELECTED_DEVICES,
          payload: [{ id: 'device-123' }],
        },
        '*'
      );
    });

    it('should emit v2:dashboard:devices:selected when selectedDevices is processed', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };
      const devices = [{ id: 'dev1' }, { id: 'dev2' }];

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICES,
        devices,
        dispatch,
        satisfiedEventsRef
      );

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: INBOUND_EVENTS_V2.SELECTED_DEVICES, payload: devices },
        '*'
      );
    });

    it('should emit v2:dashboard:settings:daterange when selectedDashboardDateRange is processed', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };
      const dateRange = { startTime: 1000, endTime: 2000 };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DASHBOARD_DATE_RANGE,
        dateRange,
        dispatch,
        satisfiedEventsRef
      );

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: INBOUND_EVENTS_V2.SELECTED_DATE_RANGE, payload: dateRange },
        '*'
      );
    });

    it('should emit v2:dashboard:self when selectedDashboardObject is processed', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };
      const dashboardObject = { id: 'dash-1', name: 'Dashboard' };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DASHBOARD_OBJECT,
        dashboardObject,
        dispatch,
        satisfiedEventsRef
      );

      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          event: INBOUND_EVENTS_V2.SELECTED_DASHBOARD_OBJECT,
          payload: dashboardObject,
        },
        '*'
      );
    });

    it('should emit v2:dashboard:settings:filters when selectedFilters is processed', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };
      const filters = [{ id: 'filter1', value: 'value1' }];

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_FILTERS,
        filters,
        dispatch,
        satisfiedEventsRef
      );

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: INBOUND_EVENTS_V2.SELECTED_FILTERS, payload: filters },
        '*'
      );
    });

    it('should emit v2:dashboard:settings:rt when isRealTimeActive is processed', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };

      handleInboundMessage(
        INBOUND_EVENTS.IS_REAL_TIME_ACTIVE,
        true,
        dispatch,
        satisfiedEventsRef
      );

      expect(postMessageSpy).toHaveBeenCalledWith(
        { event: INBOUND_EVENTS_V2.REALTIME_ACTIVE, payload: true },
        '*'
      );
    });

    it('should NOT emit V2 event when selectedDevice payload is invalid', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };

      handleInboundMessage(
        INBOUND_EVENTS.SELECTED_DEVICE,
        null,
        dispatch,
        satisfiedEventsRef
      );

      expect(postMessageSpy).not.toHaveBeenCalled();
    });
  });

  describe('V2 Events direct handlers', () => {
    it('should handle v2:auth:token event', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };

      handleInboundMessage(
        INBOUND_EVENTS_V2.TOKEN,
        'v2-token',
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'RECEIVED_TOKEN',
        payload: 'v2-token',
      });
      expect(satisfiedEventsRef.current.has('receivedToken')).toBe(true);
    });

    it('should handle v2:auth:jwt event', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };

      handleInboundMessage(
        INBOUND_EVENTS_V2.JWT,
        'v2-jwt-token',
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'RECEIVED_JWT_TOKEN',
        payload: 'v2-jwt-token',
      });
      expect(satisfiedEventsRef.current.has('receivedJWTToken')).toBe(true);
    });

    it('should handle v2:dashboard:devices:selected event', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };
      const devices = [{ id: 'v2-dev1' }, { id: 'v2-dev2' }];

      handleInboundMessage(
        INBOUND_EVENTS_V2.SELECTED_DEVICES,
        devices,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DEVICES',
        payload: devices,
      });
      expect(satisfiedEventsRef.current.has('selectedDevices')).toBe(true);
    });

    it('should handle v2:dashboard:settings:daterange event', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };
      const dateRange = { startTime: 5000, endTime: 6000 };

      handleInboundMessage(
        INBOUND_EVENTS_V2.SELECTED_DATE_RANGE,
        dateRange,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DASHBOARD_DATE_RANGE',
        payload: dateRange,
      });
      expect(satisfiedEventsRef.current.has('selectedDashboardDateRange')).toBe(
        true
      );
    });

    it('should handle v2:dashboard:self event', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };
      const dashboard = { id: 'v2-dash', name: 'V2 Dashboard' };

      handleInboundMessage(
        INBOUND_EVENTS_V2.SELECTED_DASHBOARD_OBJECT,
        dashboard,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_DASHBOARD_OBJECT',
        payload: dashboard,
      });
      expect(satisfiedEventsRef.current.has('selectedDashboardObject')).toBe(
        true
      );
    });

    it('should handle v2:dashboard:settings:filters event', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };
      const filters = [{ id: 'v2-filter', value: 'v2-value' }];

      handleInboundMessage(
        INBOUND_EVENTS_V2.SELECTED_FILTERS,
        filters,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SELECTED_FILTERS',
        payload: filters,
      });
      expect(satisfiedEventsRef.current.has('selectedFilters')).toBe(true);
    });

    it('should handle v2:dashboard:settings:rt event', () => {
      const dispatch = vi.fn();
      const satisfiedEventsRef = { current: new Set<ReadyEvent>() };

      handleInboundMessage(
        INBOUND_EVENTS_V2.REALTIME_ACTIVE,
        false,
        dispatch,
        satisfiedEventsRef
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: 'REAL_TIME_STATUS',
        payload: false,
      });
      expect(satisfiedEventsRef.current.has('isRealTimeActive')).toBe(true);
    });
  });
});
