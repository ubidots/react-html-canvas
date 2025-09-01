import React, { useState } from 'react';
import {
  UbidotsProvider,
  useUbidotsReady,
  useUbidotsToken,
  useUbidotsJWT,
  useUbidotsSelectedDevice,
  useUbidotsSelectedDevices,
  useUbidotsDashboardDateRange,
  useUbidotsRealTimeStatus,
  useUbidotsDeviceObject,
  useUbidotsDashboardObject,
  useUbidotsWidget,
  useUbidotsActions,
  useUbidotsAPI,
} from '@ubidots/react-html-canvas';
import './styles.css';

function DataDisplay() {
  const ready = useUbidotsReady();
  const token = useUbidotsToken();
  const jwtToken = useUbidotsJWT();
  const selectedDevice = useUbidotsSelectedDevice();
  const selectedDevices = useUbidotsSelectedDevices();
  const dateRange = useUbidotsDashboardDateRange();
  const realTimeStatus = useUbidotsRealTimeStatus();
  const deviceObject = useUbidotsDeviceObject();
  const dashboardObject = useUbidotsDashboardObject();
  const widget = useUbidotsWidget();
  const api = useUbidotsAPI();

  return (
    <div className='data-display'>
      <h2>📊 All Hook Data</h2>

      <div className='card'>
        <h3>🔄 System Status</h3>
        <p>
          <strong>Ready:</strong> {ready ? '✅ Yes' : '❌ No'}
        </p>
        <p>
          <strong>Real-time:</strong>{' '}
          {realTimeStatus === null
            ? '⏳ Unknown'
            : realTimeStatus
              ? '🟢 Active'
              : '🔴 Inactive'}
        </p>
      </div>

      <div className='card'>
        <h3>🔐 Authentication</h3>
        <p>
          <strong>Token:</strong>{' '}
          {token ? `${token.substring(0, 20)}...` : '❌ None'}
        </p>
        <p>
          <strong>JWT Token:</strong>{' '}
          {jwtToken ? `${jwtToken.substring(0, 20)}...` : '❌ None'}
        </p>
        <p>
          <strong>API Client:</strong>{' '}
          {api ? '✅ Available' : '❌ Not available'}
        </p>
      </div>

      <div className='card'>
        <h3>📱 Device Selection</h3>
        <p>
          <strong>Single Device:</strong>
        </p>
        <pre className='code-block'>
          {selectedDevice
            ? JSON.stringify(selectedDevice, null, 2)
            : 'None selected'}
        </pre>

        <p>
          <strong>Multiple Devices:</strong>
        </p>
        <pre className='code-block'>
          {selectedDevices
            ? JSON.stringify(selectedDevices, null, 2)
            : 'None selected'}
        </pre>
      </div>

      <div className='card'>
        <h3>📅 Date Range</h3>
        <pre className='code-block'>
          {dateRange
            ? JSON.stringify(
                {
                  ...dateRange,
                  startTimeISO: dateRange.startTime
                    ? (() => {
                        const date = new Date(dateRange.startTime);
                        return isNaN(date.getTime())
                          ? 'Invalid date'
                          : date.toISOString();
                      })()
                    : 'No start time',
                  endTimeISO: dateRange.endTime
                    ? (() => {
                        const date = new Date(dateRange.endTime);
                        return isNaN(date.getTime())
                          ? 'Invalid date'
                          : date.toISOString();
                      })()
                    : 'No end time',
                },
                null,
                2
              )
            : 'No date range set'}
        </pre>
      </div>

      <div className='card'>
        <h3>🎛️ Widget Information</h3>
        <pre className='code-block'>
          {widget ? JSON.stringify(widget, null, 2) : 'No widget data'}
        </pre>
      </div>

      <div className='card'>
        <h3>📦 Objects</h3>
        <p>
          <strong>Device Object:</strong>
        </p>
        <pre className='code-block'>
          {deviceObject
            ? JSON.stringify(deviceObject, null, 2)
            : 'No device object'}
        </pre>

        <p>
          <strong>Dashboard Object:</strong>
        </p>
        <pre className='code-block'>
          {dashboardObject
            ? JSON.stringify(dashboardObject, null, 2)
            : 'No dashboard object'}
        </pre>
      </div>
    </div>
  );
}

function ActionsPanel() {
  const actions = useUbidotsActions();
  const [deviceId, setDeviceId] = useState('');
  const [deviceIds, setDeviceIds] = useState('');
  const [drawerUrl, setDrawerUrl] = useState('');
  const [drawerWidth, setDrawerWidth] = useState(400);

  const handleSetDateRange = () => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    actions.setDashboardDateRange({
      startTime: oneHourAgo,
      endTime: now,
    });
  };

  const handleSetMultipleDevices = () => {
    const ids = deviceIds
      .split(',')
      .map(id => id.trim())
      .filter(Boolean);
    actions.setDashboardMultipleDevices(ids);
  };

  const handleOpenDrawer = () => {
    actions.openDrawer({
      url: drawerUrl,
      width: drawerWidth,
    });
  };

  const handleGetHeaders = () => {
    const headers = actions.getHeaders();
    // eslint-disable-next-line no-console, no-undef
    console.log('Authentication headers:', headers);
    // eslint-disable-next-line no-undef
    alert(`Headers logged to console: ${JSON.stringify(headers, null, 2)}`);
  };

  return (
    <div className='actions-panel'>
      <h2>🎮 Actions Panel</h2>

      <div className='action-group'>
        <h3>📱 Device Actions</h3>
        <div className='input-group'>
          <input
            type='text'
            value={deviceId}
            onChange={e => setDeviceId(e.target.value)}
            placeholder='Device ID'
            className='input-field input-device'
          />
          <button
            className='button button-primary'
            onClick={() => actions.setDashboardDevice(deviceId)}
          >
            Set Single Device
          </button>
        </div>

        <div className='input-group'>
          <input
            type='text'
            value={deviceIds}
            onChange={e => setDeviceIds(e.target.value)}
            placeholder='Device IDs (comma separated)'
            className='input-field input-devices'
          />
          <button
            className='button button-primary'
            onClick={handleSetMultipleDevices}
          >
            Set Multiple Devices
          </button>
        </div>
      </div>

      <div className='action-group'>
        <h3>📅 Date & Time Actions</h3>
        <button className='button button-success' onClick={handleSetDateRange}>
          Set Last Hour Range
        </button>
        <button
          className='button button-warning'
          onClick={() => actions.setRealTime(true)}
        >
          Enable Real-time
        </button>
        <button
          className='button button-danger'
          onClick={() => actions.setRealTime(false)}
        >
          Disable Real-time
        </button>
      </div>

      <div className='action-group'>
        <h3>🖥️ Dashboard Actions</h3>
        <button
          className='button button-success'
          onClick={actions.refreshDashboard}
        >
          🔄 Refresh Dashboard
        </button>
        <button
          className='button button-primary'
          onClick={() => actions.setFullScreen('toggle')}
        >
          🔄 Toggle Fullscreen
        </button>
        <button
          className='button button-primary'
          onClick={() => actions.setFullScreen('enable')}
        >
          📺 Enable Fullscreen
        </button>
        <button
          className='button button-primary'
          onClick={() => actions.setFullScreen('disabled')}
        >
          🪟 Disable Fullscreen
        </button>
      </div>

      <div className='action-group'>
        <h3>📂 Drawer Actions</h3>
        <div className='input-group'>
          <input
            type='text'
            value={drawerUrl}
            onChange={e => setDrawerUrl(e.target.value)}
            placeholder='Drawer URL'
            className='input-field input-url'
          />
          <input
            type='number'
            value={drawerWidth}
            onChange={e => setDrawerWidth(Number(e.target.value))}
            placeholder='Width'
            className='input-field input-width'
          />
          <button className='button button-primary' onClick={handleOpenDrawer}>
            Open Drawer
          </button>
        </div>
      </div>

      <div className='action-group'>
        <h3>🔐 API Actions</h3>
        <button className='button button-warning' onClick={handleGetHeaders}>
          Get Auth Headers
        </button>
      </div>
    </div>
  );
}

export function CompleteWidget() {
  const [logs, setLogs] = useState([]);

  const addLog = message => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const validateOrigin = origin => {
    const allowed = [
      'http://localhost',
      'https://app.ubidots.com',
      'https://industrial.ubidots.com',
    ];
    const isValid = allowed.some(allowedOrigin =>
      origin.startsWith(allowedOrigin)
    );
    addLog(
      `Origin validation: ${origin} -> ${isValid ? 'ALLOWED' : 'BLOCKED'}`
    );
    return isValid;
  };

  return (
    <UbidotsProvider
      onReady={() => addLog('🎉 Ubidots system is ready!')}
      validateOrigin={validateOrigin}
    >
      <div className='container'>
        <header className='header'>
          <h1>🚀 Complete Ubidots Widget Example</h1>
          <p>
            Comprehensive demonstration of all @ubidots/react-html-canvas
            features
          </p>
        </header>

        <div className='main-content'>
          <div className='data-section'>
            <DataDisplay />
          </div>

          <div className='actions-section'>
            <ActionsPanel />

            <div className='event-log'>
              <h3>📝 Event Log</h3>
              <div className='log-display'>
                {logs.length === 0 ? (
                  <div>Waiting for events...</div>
                ) : (
                  logs.map((log, index) => <div key={index}>{log}</div>)
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className='footer'>
          <p>
            This example tests all hooks, actions, and provider features of
            @ubidots/react-html-canvas
          </p>
        </footer>
      </div>
    </UbidotsProvider>
  );
}

export default CompleteWidget;
