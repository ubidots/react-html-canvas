import React from 'react';
import {
  UbidotsProvider,
  useUbidotsReady,
  useUbidotsSelectedDevice,
  useUbidotsActions,
} from '@ubidots/react-html-canvas';
import { EventEmitterPanel } from '../shared/EventEmitterPanel';
import './styles.css';

function DeviceInfo() {
  const ready = useUbidotsReady();
  const device = useUbidotsSelectedDevice();
  const { setDashboardDevice, refreshDashboard } = useUbidotsActions();
  if (!ready) {
    return (
      <div className='loading'>
        <p>🔄 Loading Ubidots connection...</p>
      </div>
    );
  }

  return (
    <div className='content'>
      <h2>📱 Device Information</h2>

      {device ? (
        <div className='device-info'>
          <h3>Current Device</h3>
          <p>
            <strong>ID:</strong> {device.id}
          </p>
          <p>
            <strong>Name:</strong> {device.name}
          </p>
          <p>
            <strong>Label:</strong> {device.label}
          </p>

          <details className='device-details'>
            <summary>View all properties</summary>
            <pre className='device-json'>{JSON.stringify(device, null, 2)}</pre>
          </details>
        </div>
      ) : (
        <div className='no-device'>
          <p>⚠️ No device selected</p>
        </div>
      )}

      <div className='button-group'>
        <button
          onClick={() => setDashboardDevice('example-device-id')}
          className='button-primary'
        >
          Select Example Device
        </button>

        <button onClick={refreshDashboard} className='button-success'>
          🔄 Refresh Dashboard
        </button>
      </div>
    </div>
  );
}

export function BasicUsage() {
  return (
    <UbidotsProvider>
      <div className='container'>
        <header className='header'>
          <h1>🚀 Ubidots React HTML Canvas - Basic Usage</h1>
          <p>Simple example showing core functionality</p>
        </header>

        <main>
          <DeviceInfo />
        </main>

        <EventEmitterPanel />
      </div>
    </UbidotsProvider>
  );
}

export default BasicUsage;
