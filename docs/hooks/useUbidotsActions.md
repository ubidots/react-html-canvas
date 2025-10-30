# useUbidotsActions

Hook that provides access to all dashboard actions for interacting with the Ubidots dashboard.

## Signature

```tsx
function useUbidotsActions(): UbidotsActions;
```

## Description

The `useUbidotsActions` hook returns an object containing all available actions that can be performed on the Ubidots dashboard. These actions allow your widget to communicate back to the dashboard and control its behavior.

## Returns

`UbidotsActions` object with the following methods:

### Device Actions

- `setDashboardDevice(deviceId: string)` - Set the selected device
- `setDashboardMultipleDevices(deviceIds: string[])` - Set multiple selected devices

### Date & Time Actions

- `setDashboardDateRange(range: DateRange)` - Set the dashboard date range
- `setRealTime(rt: boolean)` - Enable/disable real-time mode

### Dashboard Actions

- `refreshDashboard()` - Refresh the entire dashboard
- `setDashboardLayer(layerId: string)` - Switch to a specific dashboard layer
- `setFullScreen(setting: 'toggle' | 'enable' | 'disabled')` - Control fullscreen mode

### UI Actions

- `openDrawer(opts: { url: string; width: number })` - Open a side drawer

### Utility Actions

- `getHeaders()` - Get authentication headers for API calls

## Usage

### Basic Device Control

```tsx
import { useUbidotsActions } from '@ubidots/react-html-canvas';

function DeviceSelector() {
  const { setDashboardDevice } = useUbidotsActions();

  const handleDeviceSelect = (deviceId: string) => {
    setDashboardDevice(deviceId);
  };

  return (
    <div>
      <button onClick={() => handleDeviceSelect('device-001')}>
        Select Temperature Sensor
      </button>
      <button onClick={() => handleDeviceSelect('device-002')}>
        Select Humidity Sensor
      </button>
    </div>
  );
}
```

### Multiple Device Selection

```tsx
import { useUbidotsActions } from '@ubidots/react-html-canvas';

function MultiDeviceSelector() {
  const { setDashboardMultipleDevices } = useUbidotsActions();

  const selectAllSensors = () => {
    setDashboardMultipleDevices([
      'temp-sensor-01',
      'humidity-sensor-01',
      'pressure-sensor-01',
    ]);
  };

  const selectEnergyMeters = () => {
    setDashboardMultipleDevices(['energy-meter-01', 'energy-meter-02']);
  };

  return (
    <div>
      <button onClick={selectAllSensors}>Select All Sensors</button>
      <button onClick={selectEnergyMeters}>Select Energy Meters</button>
    </div>
  );
}
```

### Date Range Control

```tsx
import { useUbidotsActions } from '@ubidots/react-html-canvas';

function DateRangeControls() {
  const { setDashboardDateRange } = useUbidotsActions();

  const setLastHour = () => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    setDashboardDateRange({
      startTime: oneHourAgo,
      endTime: now,
    });
  };

  const setLast24Hours = () => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    setDashboardDateRange({
      startTime: oneDayAgo,
      endTime: now,
    });
  };

  const setCustomRange = () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    setDashboardDateRange({
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
    });
  };

  return (
    <div>
      <button onClick={setLastHour}>Last Hour</button>
      <button onClick={setLast24Hours}>Last 24 Hours</button>
      <button onClick={setCustomRange}>January 2024</button>
    </div>
  );
}
```

### Real-time Control

```tsx
import {
  useUbidotsActions,
  useUbidotsRealTimeStatus,
} from '@ubidots/react-html-canvas';

function RealTimeToggle() {
  const { setRealTime } = useUbidotsActions();
  const isRealTime = useUbidotsRealTimeStatus();

  const toggleRealTime = () => {
    setRealTime(!isRealTime);
  };

  return (
    <div>
      <button
        onClick={toggleRealTime}
        style={{
          background: isRealTime ? '#28a745' : '#dc3545',
          color: 'white',
        }}
      >
        {isRealTime ? '🟢 Real-time ON' : '🔴 Real-time OFF'}
      </button>

      <div>
        <button onClick={() => setRealTime(true)}>Enable Real-time</button>
        <button onClick={() => setRealTime(false)}>Disable Real-time</button>
      </div>
    </div>
  );
}
```

### Dashboard Controls

```tsx
import { useUbidotsActions } from '@ubidots/react-html-canvas';

function DashboardControls() {
  const { refreshDashboard, setFullScreen, setDashboardLayer } =
    useUbidotsActions();

  return (
    <div>
      <button onClick={refreshDashboard}>🔄 Refresh Dashboard</button>

      <button onClick={() => setDashboardLayer('layer-id')}>
        📊 Switch to Layer
      </button>

      <button onClick={() => setFullScreen('toggle')}>
        🔄 Toggle Fullscreen
      </button>

      <button onClick={() => setFullScreen('enable')}>
        📺 Enter Fullscreen
      </button>

      <button onClick={() => setFullScreen('disabled')}>
        🪟 Exit Fullscreen
      </button>
    </div>
  );
}
```

### Drawer Integration

The `openDrawer` action automatically uses `window.widgetId` when available (set by the Ubidots platform), ensuring proper widget identification for drawer functionality.

```tsx
import { useUbidotsActions } from '@ubidots/react-html-canvas';

function DrawerControls() {
  const { openDrawer } = useUbidotsActions();

  const openDeviceConfig = () => {
    openDrawer({
      url: 'https://app.ubidots.com/devices/config',
      width: 400,
    });
  };

  const openAnalytics = () => {
    openDrawer({
      url: 'https://app.ubidots.com/analytics',
      width: 600,
    });
  };

  const openCustomPage = () => {
    openDrawer({
      url: 'https://mycompany.com/custom-dashboard',
      width: 500,
    });
  };

  return (
    <div>
      <button onClick={openDeviceConfig}>⚙️ Device Configuration</button>
      <button onClick={openAnalytics}>📊 Analytics</button>
      <button onClick={openCustomPage}>🔗 Custom Page</button>
    </div>
  );
}
```

> **Note:** The drawer functionality requires `window.widgetId` to be set by the Ubidots platform. This is automatically handled when your widget runs inside a Ubidots dashboard.

### API Authentication

```tsx
import { useUbidotsActions } from '@ubidots/react-html-canvas';

function ApiExample() {
  const { getHeaders } = useUbidotsActions();

  const makeApiCall = async () => {
    const headers = getHeaders();

    try {
      const response = await fetch(
        'https://industrial.api.ubidots.com/api/v1.6/devices/',
        {
          method: 'GET',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('Devices:', data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  const logHeaders = () => {
    const headers = getHeaders();
    console.log('Current headers:', headers);
    // Example output:
    // {
    //   "Authorization": "Token BBFF-abc123...",
    //   "Content-type": "application/json"
    // }
    // or
    // {
    //   "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGc...",
    //   "Content-type": "application/json"
    // }
  };

  return (
    <div>
      <button onClick={makeApiCall}>📡 Make API Call</button>
      <button onClick={logHeaders}>🔍 Log Headers</button>
    </div>
  );
}
```

### Complete Action Panel

```tsx
import { useUbidotsActions } from '@ubidots/react-html-canvas';

function ActionPanel() {
  const actions = useUbidotsActions();

  return (
    <div style={{ padding: '20px' }}>
      <h3>Dashboard Actions</h3>

      <div style={{ marginBottom: '15px' }}>
        <h4>Device Control</h4>
        <button onClick={() => actions.setDashboardDevice('sensor-01')}>
          Select Sensor 01
        </button>
        <button
          onClick={() =>
            actions.setDashboardMultipleDevices(['sensor-01', 'sensor-02'])
          }
        >
          Select Multiple Sensors
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4>Time Control</h4>
        <button onClick={() => actions.setRealTime(true)}>
          Enable Real-time
        </button>
        <button
          onClick={() => {
            const now = Date.now();
            actions.setDashboardDateRange({
              startTime: now - 60 * 60 * 1000,
              endTime: now,
            });
          }}
        >
          Last Hour
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4>Dashboard Control</h4>
        <button onClick={actions.refreshDashboard}>Refresh</button>
        <button onClick={() => actions.setFullScreen('toggle')}>
          Toggle Fullscreen
        </button>
      </div>

      <div>
        <h4>External Links</h4>
        <button
          onClick={() =>
            actions.openDrawer({
              url: 'https://docs.ubidots.com',
              width: 500,
            })
          }
        >
          Open Documentation
        </button>
      </div>
    </div>
  );
}
```

## Best Practices

### 1. Validate Input Data

```tsx
function SafeDeviceSelector() {
  const { setDashboardDevice } = useUbidotsActions();

  const selectDevice = (deviceId: string) => {
    // Validate device ID
    if (!deviceId || typeof deviceId !== 'string') {
      console.error('Invalid device ID');
      return;
    }

    setDashboardDevice(deviceId);
  };

  return (
    <button onClick={() => selectDevice('valid-device-id')}>Select</button>
  );
}
```

### 2. Handle Errors Gracefully

```tsx
function RobustActions() {
  const actions = useUbidotsActions();

  const safeRefresh = () => {
    try {
      actions.refreshDashboard();
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
      // Show user-friendly error message
    }
  };

  return <button onClick={safeRefresh}>Refresh</button>;
}
```

### 3. Provide User Feedback

```tsx
function FeedbackActions() {
  const { setDashboardDevice } = useUbidotsActions();
  const [loading, setLoading] = useState(false);

  const selectDeviceWithFeedback = async (deviceId: string) => {
    setLoading(true);
    try {
      setDashboardDevice(deviceId);
      // Show success message
      toast.success('Device selected successfully');
    } catch (error) {
      toast.error('Failed to select device');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={() => selectDeviceWithFeedback('device-01')}
      disabled={loading}
    >
      {loading ? 'Selecting...' : 'Select Device'}
    </button>
  );
}
```

## Related Hooks

- [`useUbidotsReady`](./useUbidotsReady.md) - Check if actions are available
- [`useUbidotsSelectedDevice`](./useUbidotsSelectedDevice.md) - Get current device
- [`useUbidotsAPI`](./useUbidotsAPI.md) - Get API client

## Related Types

TypeScript type definitions are available in the library. Detailed type documentation is being prepared.

## Examples

- [Complete Widget Example](../../examples/complete-widget/) - All actions demonstrated
- [Device Selector Example](../../examples/device-selector/) - Device selection actions
