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

/**
 * Component that displays all available data from hooks
 */
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

  const cardStyle = {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    margin: '10px 0',
  };

  const codeStyle = {
    background: '#f8f9fa',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    border: '1px solid #e9ecef',
    overflow: 'auto',
    maxHeight: '200px',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
  };

  return (
    <div
      style={{
        padding: '20px',
        maxHeight: '80vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #f1f1f1',
      }}
    >
      <h2>📊 All Hook Data</h2>

      <div style={cardStyle}>
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

      <div style={cardStyle}>
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

      <div style={cardStyle}>
        <h3>📱 Device Selection</h3>
        <p>
          <strong>Single Device:</strong>
        </p>
        <pre style={codeStyle}>
          {selectedDevice
            ? JSON.stringify(selectedDevice, null, 2)
            : 'None selected'}
        </pre>

        <p>
          <strong>Multiple Devices:</strong>
        </p>
        <pre style={codeStyle}>
          {selectedDevices
            ? JSON.stringify(selectedDevices, null, 2)
            : 'None selected'}
        </pre>
      </div>

      <div style={cardStyle}>
        <h3>📅 Date Range</h3>
        <pre style={codeStyle}>
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

      <div style={cardStyle}>
        <h3>🎛️ Widget Information</h3>
        <pre style={codeStyle}>
          {widget ? JSON.stringify(widget, null, 2) : 'No widget data'}
        </pre>
      </div>

      <div style={cardStyle}>
        <h3>📦 Objects</h3>
        <p>
          <strong>Device Object:</strong>
        </p>
        <pre style={codeStyle}>
          {deviceObject
            ? JSON.stringify(deviceObject, null, 2)
            : 'No device object'}
        </pre>

        <p>
          <strong>Dashboard Object:</strong>
        </p>
        <pre style={codeStyle}>
          {dashboardObject
            ? JSON.stringify(dashboardObject, null, 2)
            : 'No dashboard object'}
        </pre>
      </div>
    </div>
  );
}

/**
 * Component that demonstrates all available actions
 */
function ActionsPanel() {
  const actions = useUbidotsActions();
  const [deviceId, setDeviceId] = useState('example-device-123');
  const [deviceIds, setDeviceIds] = useState('device-1,device-2,device-3');
  const [drawerUrl, setDrawerUrl] = useState('https://example.com');
  const [drawerWidth, setDrawerWidth] = useState(400);

  const buttonStyle = {
    padding: '8px 12px',
    margin: '5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const primaryButton = {
    ...buttonStyle,
    background: '#007bff',
    color: 'white',
  };
  const successButton = {
    ...buttonStyle,
    background: '#28a745',
    color: 'white',
  };
  const warningButton = {
    ...buttonStyle,
    background: '#ffc107',
    color: 'black',
  };
  const dangerButton = {
    ...buttonStyle,
    background: '#dc3545',
    color: 'white',
  };

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
    console.log('Authentication headers:', headers);
    alert(`Headers logged to console: ${JSON.stringify(headers, null, 2)}`);
  };

  return (
    <div style={{ padding: '20px', background: '#f8f9fa' }}>
      <h2>🎮 Actions Panel</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>📱 Device Actions</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type='text'
            value={deviceId}
            onChange={e => setDeviceId(e.target.value)}
            placeholder='Device ID'
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <button
            style={primaryButton}
            onClick={() => actions.setDashboardDevice(deviceId)}
          >
            Set Single Device
          </button>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type='text'
            value={deviceIds}
            onChange={e => setDeviceIds(e.target.value)}
            placeholder='Device IDs (comma separated)'
            style={{ padding: '8px', marginRight: '10px', width: '300px' }}
          />
          <button style={primaryButton} onClick={handleSetMultipleDevices}>
            Set Multiple Devices
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>📅 Date & Time Actions</h3>
        <button style={successButton} onClick={handleSetDateRange}>
          Set Last Hour Range
        </button>
        <button style={warningButton} onClick={() => actions.setRealTime(true)}>
          Enable Real-time
        </button>
        <button style={dangerButton} onClick={() => actions.setRealTime(false)}>
          Disable Real-time
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>🖥️ Dashboard Actions</h3>
        <button style={successButton} onClick={actions.refreshDashboard}>
          🔄 Refresh Dashboard
        </button>
        <button
          style={primaryButton}
          onClick={() => actions.setFullScreen('toggle')}
        >
          🔄 Toggle Fullscreen
        </button>
        <button
          style={primaryButton}
          onClick={() => actions.setFullScreen('enable')}
        >
          📺 Enable Fullscreen
        </button>
        <button
          style={primaryButton}
          onClick={() => actions.setFullScreen('disabled')}
        >
          🪟 Disable Fullscreen
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>📂 Drawer Actions</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type='text'
            value={drawerUrl}
            onChange={e => setDrawerUrl(e.target.value)}
            placeholder='Drawer URL'
            style={{ padding: '8px', marginRight: '10px', width: '250px' }}
          />
          <input
            type='number'
            value={drawerWidth}
            onChange={e => setDrawerWidth(Number(e.target.value))}
            placeholder='Width'
            style={{ padding: '8px', marginRight: '10px', width: '80px' }}
          />
          <button style={primaryButton} onClick={handleOpenDrawer}>
            Open Drawer
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>🔐 API Actions</h3>
        <button style={warningButton} onClick={handleGetHeaders}>
          Get Auth Headers
        </button>
      </div>
    </div>
  );
}

/**
 * Complete widget example that demonstrates ALL features
 *
 * This is the most comprehensive example showing:
 * - All available hooks
 * - All available actions
 * - Provider configuration options
 * - Error handling
 * - Real-world usage patterns
 */
export function CompleteWidget() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const validateOrigin = (origin: string) => {
    // In production, validate against your allowed origins
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
      readyEvents={['receivedToken', 'selectedDevice']}
      onReady={() => addLog('🎉 Ubidots system is ready!')}
      validateOrigin={validateOrigin}
      initialStateOverride={{
        // You can override initial state for testing
        ready: false,
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          maxHeight: '100vh',
          background: '#f0f2f5',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #f1f1f1',
        }}
      >
        <header
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '30px',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <h1>🚀 Complete Ubidots Widget Example</h1>
          <p>
            Comprehensive demonstration of all @ubidots/react-html-canvas
            features
          </p>
        </header>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 600px', minWidth: '600px' }}>
            <DataDisplay />
          </div>

          <div style={{ flex: '1 1 400px', minWidth: '400px' }}>
            <ActionsPanel />

            {/* Event Log */}
            <div style={{ padding: '20px' }}>
              <h3>📝 Event Log</h3>
              <div
                style={{
                  background: '#000',
                  color: '#00ff00',
                  padding: '15px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  height: '200px',
                  overflow: 'auto',
                }}
              >
                {logs.length === 0 ? (
                  <div>Waiting for events...</div>
                ) : (
                  logs.map((log, index) => <div key={index}>{log}</div>)
                )}
              </div>
            </div>
          </div>
        </div>

        <footer
          style={{
            background: '#343a40',
            color: 'white',
            padding: '20px',
            textAlign: 'center',
            marginTop: '40px',
          }}
        >
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
