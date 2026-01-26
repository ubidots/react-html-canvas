import React from 'react';
import {
  UbidotsProvider,
  withSelectedDevice,
  withUbidotsActions,
  compose,
} from '@ubidots/react-html-canvas';
import { EventEmitterPanel } from '../shared/EventEmitterPanel';
import './styles.css';

function DeviceDisplay({ selectedDevice, title = 'Device Information' }) {
  if (!selectedDevice) {
    return (
      <div className='device-display-empty'>
        <h3>{title}</h3>
        <p>No device selected</p>
      </div>
    );
  }

  return (
    <div className='device-display'>
      <h3>{title}</h3>
      <div className='device-info'>
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

        <details className='device-details'>
          <summary>View all properties</summary>
          <pre className='device-json'>
            {JSON.stringify(selectedDevice, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

function DeviceControls({ ubidotsActions, deviceId = 'example-device' }) {
  if (!ubidotsActions) {
    return <div>Actions not available</div>;
  }

  return (
    <div className='device-controls'>
      <h3>Device Controls</h3>
      <div className='button-group'>
        <button
          className='button button-primary'
          onClick={() => ubidotsActions.setDashboardDevice(deviceId)}
        >
          Select Device
        </button>

        <button
          className='button button-success'
          onClick={ubidotsActions.refreshDashboard}
        >
          🔄 Refresh
        </button>

        <button
          className='button button-info'
          onClick={() => ubidotsActions.setRealTime(true)}
        >
          ⚡ Enable Real-time
        </button>

        <button
          className='button button-danger'
          onClick={() => ubidotsActions.setRealTime(false)}
        >
          ⏸️ Disable Real-time
        </button>
      </div>
    </div>
  );
}

function CombinedWidget({ selectedDevice, ubidotsActions }) {
  const handleQuickActions = () => {
    if (!ubidotsActions) return;

    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    ubidotsActions.setDashboardDateRange({
      startTime: oneHourAgo,
      endTime: now,
    });
  };

  const switchDevice = deviceId => {
    if (ubidotsActions) {
      ubidotsActions.setDashboardDevice(deviceId);
    }
  };

  return (
    <div className='combined-widget'>
      <h3>🚀 Combined Widget (Device + Actions)</h3>

      {selectedDevice ? (
        <div className='current-device'>
          <h4>Current Device</h4>
          <p className='device-selected'>
            📱 {selectedDevice.name || selectedDevice.id}
          </p>
        </div>
      ) : (
        <div className='device-none'>⚠️ No device selected</div>
      )}

      <div className='button-group'>
        <button
          onClick={handleQuickActions}
          disabled={!ubidotsActions}
          className={`button ${ubidotsActions ? 'button-success' : ''}`}
        >
          📅 Set Last Hour Range
        </button>

        <button
          onClick={() => switchDevice('sensor-001')}
          disabled={!ubidotsActions}
          className={`button ${ubidotsActions ? 'button-primary' : ''}`}
        >
          🌡️ Switch to Sensor 001
        </button>

        <button
          onClick={() => switchDevice('sensor-002')}
          disabled={!ubidotsActions}
          className={`button ${ubidotsActions ? 'button-purple' : ''}`}
        >
          💧 Switch to Sensor 002
        </button>
      </div>
    </div>
  );
}

const EnhancedDeviceDisplay = withSelectedDevice(DeviceDisplay);
const EnhancedDeviceControls = withUbidotsActions(DeviceControls);

const EnhancedCombinedWidget = compose(
  withSelectedDevice,
  withUbidotsActions
)(CombinedWidget);

const ManuallyComposedWidget = withSelectedDevice(
  withUbidotsActions(CombinedWidget)
);

class ClassDeviceDisplay extends React.Component {
  render() {
    const { selectedDevice } = this.props;

    return (
      <div className='class-component'>
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
    <UbidotsProvider>
      <div className='container'>
        <header className='header'>
          <h1>🔧 Higher-Order Components (HOCs) Example</h1>
          <p>
            Demonstrates using withSelectedDevice and withUbidotsActions HOCs
          </p>
        </header>

        <div className='content'>
          <div className='section'>
            <h2>📱 Device Display (withSelectedDevice HOC)</h2>
            <p>Component receives selectedDevice as prop automatically</p>
            <EnhancedDeviceDisplay title='Enhanced Device Display' />
          </div>

          <div className='section'>
            <h2>🎮 Device Controls (withUbidotsActions HOC)</h2>
            <p>Component receives ubidotsActions as prop automatically</p>
            <EnhancedDeviceControls deviceId='test-device-123' />
          </div>

          <div className='section'>
            <h2>🚀 Combined Widget (Multiple HOCs with compose)</h2>
            <p>
              Component receives both selectedDevice and ubidotsActions props
            </p>
            <EnhancedCombinedWidget />
          </div>

          <div className='section'>
            <h2>🔄 Manually Composed Widget</h2>
            <p>
              Same as above but composed manually without the compose utility
            </p>
            <ManuallyComposedWidget />
          </div>

          <div className='section'>
            <h2>📊 Class Component with HOC</h2>
            <p>HOCs work with class components too</p>
            <EnhancedClassComponent />
          </div>

          <div className='benefits-section'>
            <h3>💡 HOC Benefits</h3>
            <ul className='benefits-list'>
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

          <div className='comparison-section'>
            <h3>🎯 When to Use HOCs vs Hooks</h3>
            <div className='comparison-grid'>
              <div className='comparison-column'>
                <h4>Use HOCs when:</h4>
                <ul className='comparison-list'>
                  <li>Working with class components</li>
                  <li>Need to inject props consistently</li>
                  <li>Want to enhance existing components</li>
                  <li>Building reusable component libraries</li>
                </ul>
              </div>
              <div className='comparison-column'>
                <h4>Use Hooks when:</h4>
                <ul className='comparison-list'>
                  <li>Working with functional components</li>
                  <li>Need more control over data flow</li>
                  <li>Want to handle loading/error states</li>
                  <li>Building new components from scratch</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <EventEmitterPanel />
      </div>
    </UbidotsProvider>
  );
}

export default WithHocsExample;
