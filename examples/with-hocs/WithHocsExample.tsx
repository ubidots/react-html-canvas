import React from 'react';
import {
  UbidotsProvider,
  withSelectedDevice,
  withUbidotsActions,
  compose,
} from '@ubidots/react-html-canvas';

// Component that receives device as prop via HOC
interface DeviceDisplayProps {
  selectedDevice?: {
    id: string;
    name?: string;
    label?: string;
    description?: string;
  } | null;
  title?: string;
}

function DeviceDisplay({
  selectedDevice,
  title = 'Device Information',
}: DeviceDisplayProps) {
  if (!selectedDevice) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>{title}</h3>
        <p>No device selected</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        margin: '10px 0',
      }}
    >
      <h3>{title}</h3>
      <div
        style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px' }}
      >
        <p>
          <strong>ID:</strong> {selectedDevice.id}
        </p>
        <p>
          <strong>Name:</strong> {selectedDevice.name || 'Unnamed Device'}
        </p>
        <p>
          <strong>Label:</strong> {selectedDevice.label || 'No label'}
        </p>

        {selectedDevice.description && (
          <p>
            <strong>Description:</strong> {selectedDevice.description}
          </p>
        )}

        <details style={{ marginTop: '10px' }}>
          <summary>View all properties</summary>
          <pre
            style={{
              background: '#fff',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
              marginTop: '10px',
            }}
          >
            {JSON.stringify(selectedDevice, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

// Component that receives actions as prop via HOC
interface DeviceControlsProps {
  ubidotsActions?: {
    setDashboardDevice: (deviceId: string) => void;
    setDashboardMultipleDevices: (deviceIds: string[]) => void;
    setDashboardDateRange: (range: {
      startTime: number;
      endTime: number;
    }) => void;
    setRealTime: (rt: boolean) => void;
    refreshDashboard: () => void;
    openDrawer: (opts: { url: string; width: number }) => void;
    setFullScreen: (setting: 'toggle' | 'enable' | 'disabled') => void;
    getHeaders: () => Record<string, string>;
  };
  deviceId?: string;
}

function DeviceControls({
  ubidotsActions,
  deviceId = 'example-device',
}: DeviceControlsProps) {
  if (!ubidotsActions) {
    return <div>Actions not available</div>;
  }

  const buttonStyle = {
    padding: '10px 15px',
    margin: '5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Device Controls</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button
          style={{ ...buttonStyle, background: '#007bff', color: 'white' }}
          onClick={() => ubidotsActions.setDashboardDevice(deviceId)}
        >
          Select Device
        </button>

        <button
          style={{ ...buttonStyle, background: '#28a745', color: 'white' }}
          onClick={ubidotsActions.refreshDashboard}
        >
          🔄 Refresh
        </button>

        <button
          style={{ ...buttonStyle, background: '#17a2b8', color: 'white' }}
          onClick={() => ubidotsActions.setRealTime(true)}
        >
          ⚡ Enable Real-time
        </button>

        <button
          style={{ ...buttonStyle, background: '#dc3545', color: 'white' }}
          onClick={() => ubidotsActions.setRealTime(false)}
        >
          ⏸️ Disable Real-time
        </button>
      </div>
    </div>
  );
}

// Component that receives both device and actions via HOCs
interface CombinedWidgetProps {
  selectedDevice?: {
    id: string;
    name?: string;
    label?: string;
    description?: string;
  } | null;
  ubidotsActions?: {
    setDashboardDevice: (deviceId: string) => void;
    setDashboardMultipleDevices: (deviceIds: string[]) => void;
    setDashboardDateRange: (range: {
      startTime: number;
      endTime: number;
    }) => void;
    setRealTime: (rt: boolean) => void;
    refreshDashboard: () => void;
    openDrawer: (opts: { url: string; width: number }) => void;
    setFullScreen: (setting: 'toggle' | 'enable' | 'disabled') => void;
    getHeaders: () => Record<string, string>;
  };
}

function CombinedWidget({
  selectedDevice,
  ubidotsActions,
}: CombinedWidgetProps) {
  const handleQuickActions = () => {
    if (!ubidotsActions) return;

    // Set a date range for the last hour
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    ubidotsActions.setDashboardDateRange({
      startTime: oneHourAgo,
      endTime: now,
    });
  };

  const switchDevice = (deviceId: string) => {
    if (ubidotsActions) {
      ubidotsActions.setDashboardDevice(deviceId);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid #007bff',
        borderRadius: '8px',
        background: '#f8f9fa',
      }}
    >
      <h3>🚀 Combined Widget (Device + Actions)</h3>

      {selectedDevice ? (
        <div style={{ marginBottom: '20px' }}>
          <h4>Current Device</h4>
          <p
            style={{
              background: '#d4edda',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #c3e6cb',
            }}
          >
            📱 {selectedDevice.name || selectedDevice.id}
          </p>
        </div>
      ) : (
        <div
          style={{
            background: '#fff3cd',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #ffeaa7',
            marginBottom: '20px',
          }}
        >
          ⚠️ No device selected
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button
          onClick={handleQuickActions}
          disabled={!ubidotsActions}
          style={{
            padding: '10px 15px',
            background: ubidotsActions ? '#28a745' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: ubidotsActions ? 'pointer' : 'not-allowed',
          }}
        >
          📅 Set Last Hour Range
        </button>

        <button
          onClick={() => switchDevice('sensor-001')}
          disabled={!ubidotsActions}
          style={{
            padding: '10px 15px',
            background: ubidotsActions ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: ubidotsActions ? 'pointer' : 'not-allowed',
          }}
        >
          🌡️ Switch to Sensor 001
        </button>

        <button
          onClick={() => switchDevice('sensor-002')}
          disabled={!ubidotsActions}
          style={{
            padding: '10px 15px',
            background: ubidotsActions ? '#6f42c1' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: ubidotsActions ? 'pointer' : 'not-allowed',
          }}
        >
          💧 Switch to Sensor 002
        </button>
      </div>
    </div>
  );
}

// Create enhanced components using HOCs
const EnhancedDeviceDisplay = withSelectedDevice(DeviceDisplay);
const EnhancedDeviceControls = withUbidotsActions(DeviceControls);

// Create a component with multiple HOCs using compose
const EnhancedCombinedWidget = compose(
  withSelectedDevice,
  withUbidotsActions
)(CombinedWidget);

// Alternative way to compose HOCs manually
const ManuallyComposedWidget = withSelectedDevice(
  withUbidotsActions(CombinedWidget)
);

// Class component example with HOCs
class ClassDeviceDisplay extends React.Component<DeviceDisplayProps> {
  render() {
    const { selectedDevice } = this.props;

    return (
      <div
        style={{ padding: '20px', background: '#e9ecef', borderRadius: '8px' }}
      >
        <h3>📊 Class Component with HOC</h3>
        {selectedDevice ? (
          <div>
            <p>Device ID: {selectedDevice.id}</p>
            <p>Device Name: {selectedDevice.name || 'Unnamed'}</p>
          </div>
        ) : (
          <p>No device available</p>
        )}
      </div>
    );
  }
}

const EnhancedClassComponent = withSelectedDevice(ClassDeviceDisplay);

export function WithHocsExample() {
  return (
    <UbidotsProvider readyEvents={['receivedToken']}>
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <header
          style={{
            background: '#343a40',
            color: 'white',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <h1>🔧 Higher-Order Components (HOCs) Example</h1>
          <p>
            Demonstrates using withSelectedDevice and withUbidotsActions HOCs
          </p>
        </header>

        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h2>📱 Device Display (withSelectedDevice HOC)</h2>
            <p>Component receives selectedDevice as prop automatically</p>
            <EnhancedDeviceDisplay title='Enhanced Device Display' />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2>🎮 Device Controls (withUbidotsActions HOC)</h2>
            <p>Component receives ubidotsActions as prop automatically</p>
            <EnhancedDeviceControls deviceId='test-device-123' />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2>🚀 Combined Widget (Multiple HOCs with compose)</h2>
            <p>
              Component receives both selectedDevice and ubidotsActions props
            </p>
            <EnhancedCombinedWidget />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2>🔄 Manually Composed Widget</h2>
            <p>
              Same as above but composed manually without the compose utility
            </p>
            <ManuallyComposedWidget />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2>📊 Class Component with HOC</h2>
            <p>HOCs work with class components too</p>
            <EnhancedClassComponent />
          </div>

          <div
            style={{
              background: '#d1ecf1',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #bee5eb',
            }}
          >
            <h3>💡 HOC Benefits</h3>
            <ul>
              <li>
                ✅ <strong>Prop Injection:</strong> Automatically inject Ubidots
                data as props
              </li>
              <li>
                ✅ <strong>Reusability:</strong> Use the same component with or
                without HOCs
              </li>
              <li>
                ✅ <strong>Composition:</strong> Combine multiple HOCs using the
                compose utility
              </li>
              <li>
                ✅ <strong>Class Components:</strong> Works with both functional
                and class components
              </li>
              <li>
                ✅ <strong>Type Safety:</strong> TypeScript support for injected
                props
              </li>
              <li>
                ✅ <strong>Testing:</strong> Test components independently of
                Ubidots context
              </li>
            </ul>
          </div>

          <div
            style={{
              background: '#fff3cd',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              marginTop: '20px',
            }}
          >
            <h3>🎯 When to Use HOCs vs Hooks</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
              }}
            >
              <div>
                <h4>Use HOCs when:</h4>
                <ul>
                  <li>Working with class components</li>
                  <li>Need to inject props consistently</li>
                  <li>Want to enhance existing components</li>
                  <li>Building reusable component libraries</li>
                </ul>
              </div>
              <div>
                <h4>Use Hooks when:</h4>
                <ul>
                  <li>Working with functional components</li>
                  <li>Need more control over data flow</li>
                  <li>Want to handle loading/error states</li>
                  <li>Building new components from scratch</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UbidotsProvider>
  );
}

export default WithHocsExample;
