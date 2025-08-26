# useUbidotsSelectedDevice

Hook that returns the currently selected device from the Ubidots dashboard.

## Signature

```tsx
function useUbidotsSelectedDevice(): Device | null;
```

## Description

The `useUbidotsSelectedDevice` hook provides access to the currently selected device in the Ubidots dashboard. This device is set either by user interaction in the dashboard or programmatically through the `setDashboardDevice` action.

## Returns

- `Device | null` - The currently selected device object, or `null` if no device is selected

## Device Interface

```tsx
interface Device {
  id: string;
  name?: string;
  label?: string;
  description?: string;
  [key: string]: any; // Additional device properties
}
```

## Usage

### Basic Device Display

```tsx
import { useUbidotsSelectedDevice } from '@ubidots/react-html-canvas';

function DeviceInfo() {
  const device = useUbidotsSelectedDevice();

  if (!device) {
    return <div>No device selected</div>;
  }

  return (
    <div>
      <h3>{device.name || device.label || 'Unnamed Device'}</h3>
      <p>ID: {device.id}</p>
      {device.description && <p>Description: {device.description}</p>}
    </div>
  );
}
```

### Conditional Rendering

```tsx
import {
  useUbidotsSelectedDevice,
  useUbidotsReady,
} from '@ubidots/react-html-canvas';

function DeviceWidget() {
  const ready = useUbidotsReady();
  const device = useUbidotsSelectedDevice();

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (!device) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h3>No Device Selected</h3>
        <p>Please select a device from the dashboard to view its data.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Device: {device.name}</h2>
      <DeviceDetails device={device} />
      <DeviceVariables deviceId={device.id} />
    </div>
  );
}
```

### Device-Dependent Data Fetching

```tsx
import { useEffect, useState } from 'react';
import { useUbidotsSelectedDevice } from '@ubidots/react-html-canvas';

function DeviceData() {
  const device = useUbidotsSelectedDevice();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!device) {
      setData(null);
      return;
    }

    const fetchDeviceData = async () => {
      setLoading(true);
      try {
        // Fetch data for the selected device
        const response = await fetch(`/api/devices/${device.id}/data`);
        const deviceData = await response.json();
        setData(deviceData);
      } catch (error) {
        console.error('Failed to fetch device data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [device?.id]); // Re-fetch when device changes

  if (!device) return <div>Select a device to view data</div>;
  if (loading) return <div>Loading device data...</div>;

  return (
    <div>
      <h3>Data for {device.name}</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### Device Card Component

```tsx
import { useUbidotsSelectedDevice } from '@ubidots/react-html-canvas';

function DeviceCard() {
  const device = useUbidotsSelectedDevice();

  if (!device) return null;

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#007bff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            marginRight: '12px',
          }}
        >
          {(device.name || device.id).charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 style={{ margin: 0 }}>
            {device.name || device.label || 'Unnamed Device'}
          </h4>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            ID: {device.id}
          </p>
        </div>
      </div>

      {device.description && (
        <p style={{ margin: '8px 0', color: '#555' }}>{device.description}</p>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #eee',
        }}
      >
        <span
          style={{
            background: '#28a745',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          ✓ Selected
        </span>

        {device.lastActivity && (
          <span style={{ fontSize: '12px', color: '#666' }}>
            Last seen: {new Date(device.lastActivity).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
```

### Device Comparison

```tsx
import { useUbidotsSelectedDevice } from '@ubidots/react-html-canvas';

function DeviceComparison() {
  const currentDevice = useUbidotsSelectedDevice();
  const [previousDevice, setPreviousDevice] = useState(null);

  useEffect(() => {
    if (currentDevice && currentDevice.id !== previousDevice?.id) {
      setPreviousDevice(currentDevice);
    }
  }, [currentDevice]);

  return (
    <div>
      <div>
        <h3>Current Device</h3>
        {currentDevice ? (
          <DeviceInfo device={currentDevice} />
        ) : (
          <p>No device selected</p>
        )}
      </div>

      {previousDevice && previousDevice.id !== currentDevice?.id && (
        <div>
          <h3>Previous Device</h3>
          <DeviceInfo device={previousDevice} />
        </div>
      )}
    </div>
  );
}
```

### Device Status Indicator

```tsx
import { useUbidotsSelectedDevice } from '@ubidots/react-html-canvas';

function DeviceStatus() {
  const device = useUbidotsSelectedDevice();

  const getDeviceStatus = device => {
    if (!device) return { status: 'none', color: '#ccc', text: 'No device' };

    const lastActivity = device.lastActivity
      ? new Date(device.lastActivity)
      : null;
    const now = new Date();
    const timeDiff = lastActivity
      ? now.getTime() - lastActivity.getTime()
      : Infinity;

    if (timeDiff < 5 * 60 * 1000) {
      // 5 minutes
      return { status: 'online', color: '#28a745', text: 'Online' };
    } else if (timeDiff < 60 * 60 * 1000) {
      // 1 hour
      return { status: 'recent', color: '#ffc107', text: 'Recent' };
    } else {
      return { status: 'offline', color: '#dc3545', text: 'Offline' };
    }
  };

  const status = getDeviceStatus(device);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: status.color,
          marginRight: '8px',
        }}
      />
      <span>
        {device ? `${device.name} - ${status.text}` : 'No device selected'}
      </span>
    </div>
  );
}
```

### Device Actions Integration

```tsx
import {
  useUbidotsSelectedDevice,
  useUbidotsActions,
} from '@ubidots/react-html-canvas';

function DeviceControls() {
  const device = useUbidotsSelectedDevice();
  const { setDashboardDevice, refreshDashboard } = useUbidotsActions();

  const switchToDevice = (deviceId: string) => {
    setDashboardDevice(deviceId);
  };

  if (!device) {
    return (
      <div>
        <p>No device selected. Choose one:</p>
        <button onClick={() => switchToDevice('sensor-01')}>
          Temperature Sensor
        </button>
        <button onClick={() => switchToDevice('sensor-02')}>
          Humidity Sensor
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3>Controls for {device.name}</h3>
      <button onClick={refreshDashboard}>🔄 Refresh Data</button>
      <button onClick={() => switchToDevice('sensor-01')}>
        Switch to Temperature Sensor
      </button>
      <button onClick={() => switchToDevice('sensor-02')}>
        Switch to Humidity Sensor
      </button>
    </div>
  );
}
```

## Best Practices

### 1. Always Check for Null

```tsx
// ✅ Good - Check for null device
function DeviceDisplay() {
  const device = useUbidotsSelectedDevice();

  if (!device) {
    return <div>Please select a device</div>;
  }

  return <div>Device: {device.name}</div>;
}

// ❌ Bad - Assuming device exists
function DeviceDisplay() {
  const device = useUbidotsSelectedDevice();

  return <div>Device: {device.name}</div>; // Could throw error if device is null
}
```

### 2. Handle Device Changes

```tsx
function DeviceAwareComponent() {
  const device = useUbidotsSelectedDevice();
  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    // Clear local data when device changes
    setLocalData(null);

    if (device) {
      // Fetch new data for the selected device
      fetchDataForDevice(device.id);
    }
  }, [device?.id]);

  return device ? <DeviceContent device={device} /> : <NoDeviceMessage />;
}
```

### 3. Provide Fallback Values

```tsx
function DeviceTitle() {
  const device = useUbidotsSelectedDevice();

  const displayName =
    device?.name || device?.label || device?.id || 'Unknown Device';

  return <h2>{displayName}</h2>;
}
```

## Related Hooks

- [`useUbidotsActions`](./useUbidotsActions.md) - Device selection actions
- [`useUbidotsReady`](./useUbidotsReady.md) - Check if data is available
- [`useUbidotsAPI`](./useUbidotsAPI.md) - Get API client

## Related Types

TypeScript type definitions are available in the library. Detailed type documentation is being prepared.

## Examples

- [Device Selector Example](../../examples/device-selector/) - Interactive device selection
- [Basic Usage Example](../../examples/basic-usage/) - Simple device display
- [Complete Widget Example](../../examples/complete-widget/) - Advanced device handling
