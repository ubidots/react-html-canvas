import React from 'react';
import {
  UbidotsProvider,
  useUbidotsReady,
  useUbidotsSelectedDevice,
  useUbidotsActions,
} from '@ubidots/react-html-canvas';

/**
 * Component that displays device information and basic controls
 */
function DeviceInfo() {
  const ready = useUbidotsReady();
  const device = useUbidotsSelectedDevice();
  const { setDashboardDevice, refreshDashboard } = useUbidotsActions();

  // Show loading state while system initializes
  if (!ready) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>🔄 Loading Ubidots connection...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📱 Device Information</h2>

      {device ? (
        <div
          style={{
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <h3>Current Device</h3>
          <p>
            <strong>ID:</strong> {device.id}
          </p>
          <p>
            <strong>Name:</strong> {device.name || 'Unnamed Device'}
          </p>
          <p>
            <strong>Label:</strong> {device.label || 'No label'}
          </p>

          {/* Display additional device properties */}
          <details style={{ marginTop: '10px' }}>
            <summary>View all properties</summary>
            <pre
              style={{
                background: '#fff',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(device, null, 2)}
            </pre>
          </details>
        </div>
      ) : (
        <div
          style={{
            background: '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <p>⚠️ No device selected</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setDashboardDevice('example-device-id')}
          style={{
            padding: '10px 15px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Select Example Device
        </button>

        <button
          onClick={refreshDashboard}
          style={{
            padding: '10px 15px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🔄 Refresh Dashboard
        </button>
      </div>
    </div>
  );
}

/**
 * Basic usage example of @ubidots/react-html-canvas
 *
 * This example shows:
 * - How to set up the UbidotsProvider
 * - How to check if the system is ready
 * - How to access device information
 * - How to perform basic actions
 */
export function BasicUsage() {
  return (
    <UbidotsProvider
      readyEvents={['receivedToken']}
      onReady={() => console.log('Ubidots system is ready!')}
    >
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <header
          style={{
            background: '#343a40',
            color: 'white',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <h1>🚀 Ubidots React HTML Canvas - Basic Usage</h1>
          <p>Simple example showing core functionality</p>
        </header>

        <main>
          <DeviceInfo />
        </main>
      </div>
    </UbidotsProvider>
  );
}

export default BasicUsage;
