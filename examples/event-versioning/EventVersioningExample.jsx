import React, { useEffect, useState } from 'react';
import {
  UbidotsProvider,
  useUbidotsReady,
  useUbidotsToken,
  useUbidotsSelectedDevices,
  useUbidotsActions,
} from '@ubidots/react-html-canvas';
import { EventEmitterPanel } from '../shared/EventEmitterPanel';

/**
 * Example demonstrating V1 and V2 event compatibility
 *
 * This example shows:
 * 1. How V1 events automatically trigger V2 events
 * 2. How to listen for both V1 and V2 events
 * 3. How actions send both V1 and V2 events
 */

function EventLogger() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    function handleMessage(ev) {
      const { event, payload } = ev.data || {};
      if (event) {
        const timestamp = new Date().toLocaleTimeString();
        setEvents(prev =>
          [
            ...prev,
            { timestamp, event, payload: JSON.stringify(payload) },
          ].slice(-10)
        ); // Keep last 10 events
      }
    }

    // eslint-disable-next-line no-undef
    window.addEventListener('message', handleMessage);
    // eslint-disable-next-line no-undef
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        marginTop: '20px',
        maxHeight: '300px',
        overflow: 'auto',
      }}
    >
      <h3>Event Log (Last 10 events)</h3>
      <table style={{ width: '100%', fontSize: '12px' }}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Event</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: e.event.startsWith('v2:')
                  ? '#e3f2fd'
                  : '#fff3e0',
              }}
            >
              <td>{e.timestamp}</td>
              <td style={{ fontFamily: 'monospace' }}>{e.event}</td>
              <td style={{ fontSize: '10px' }}>{e.payload}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '10px', fontSize: '11px' }}>
        <span style={{ backgroundColor: '#fff3e0', padding: '2px 5px' }}>
          V1 Events
        </span>{' '}
        <span style={{ backgroundColor: '#e3f2fd', padding: '2px 5px' }}>
          V2 Events
        </span>
      </div>
    </div>
  );
}

function WidgetContent() {
  const ready = useUbidotsReady();
  const token = useUbidotsToken();
  const devices = useUbidotsSelectedDevices();
  const { setDashboardDevice, setDashboardMultipleDevices, setRealTime } =
    useUbidotsActions();

  if (!ready) {
    return <div>Waiting for ready state...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Event Versioning Demo</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Current State</h3>
        <p>
          <strong>Token:</strong> {token ? '✓ Received' : '✗ Not received'}
        </p>
        <p>
          <strong>Selected Devices:</strong> {devices ? devices.length : 0}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Actions (Send V1 + V2 Events)</h3>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Each button sends BOTH V1 and V2 events. Check the event log below.
        </p>

        <button
          onClick={() => setDashboardDevice('device-001')}
          style={{ margin: '5px', padding: '10px' }}
        >
          Set Single Device
          <br />
          <small style={{ fontSize: '10px' }}>
            V1: setDashboardDevice
            <br />
            V2: v2:dashboard:devices:selected
          </small>
        </button>

        <button
          onClick={() =>
            setDashboardMultipleDevices([
              'device-001',
              'device-002',
              'device-003',
            ])
          }
          style={{ margin: '5px', padding: '10px' }}
        >
          Set Multiple Devices
          <br />
          <small style={{ fontSize: '10px' }}>
            V1: setDashboardMultipleDevices
            <br />
            V2: v2:dashboard:devices:selected
          </small>
        </button>

        <button
          onClick={() => setRealTime(true)}
          style={{ margin: '5px', padding: '10px' }}
        >
          Enable Real-time
          <br />
          <small style={{ fontSize: '10px' }}>
            V1: setRealTime
            <br />
            V2: v2:dashboard:settings:rt
          </small>
        </button>
      </div>

      <EventLogger />

      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <h4>How it works:</h4>
        <ul style={{ fontSize: '13px' }}>
          <li>
            When you click a button, the library sends{' '}
            <strong>both V1 and V2 events</strong>
          </li>
          <li>V1 events (orange) maintain backward compatibility</li>
          <li>V2 events (blue) use the new naming convention</li>
          <li>External listeners can subscribe to either version</li>
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  const handleReady = () => {
    // eslint-disable-next-line no-console, no-undef
    console.log('Widget ready!');
  };

  return (
    <UbidotsProvider readyEvents={['receivedToken']} onReady={handleReady}>
      <WidgetContent />
      <EventEmitterPanel />
    </UbidotsProvider>
  );
}
