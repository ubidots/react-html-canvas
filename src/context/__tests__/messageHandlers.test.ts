import { describe, it, expect, vi } from 'vitest';
import { handleInboundMessage } from '../messageHandlers';
import { INBOUND_EVENTS } from '../constants';
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
});
