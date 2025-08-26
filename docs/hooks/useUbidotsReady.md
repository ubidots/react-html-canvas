# useUbidotsReady

Hook that returns the ready state of the Ubidots system.

## Signature

```tsx
function useUbidotsReady(): boolean;
```

## Description

The `useUbidotsReady` hook returns a boolean indicating whether the Ubidots system has completed initialization and is ready to be used. This is determined by the `readyEvents` configuration in the `UbidotsProvider`.

## Returns

- `boolean` - `true` if all required ready events have been received, `false` otherwise

## Usage

### Basic Usage

```tsx
import { useUbidotsReady } from '@ubidots/react-html-canvas';

function MyComponent() {
  const ready = useUbidotsReady();

  if (!ready) {
    return <div>Loading Ubidots connection...</div>;
  }

  return <div>System is ready!</div>;
}
```

### Conditional Rendering

```tsx
import {
  useUbidotsReady,
  useUbidotsSelectedDevice,
} from '@ubidots/react-html-canvas';

function DeviceDisplay() {
  const ready = useUbidotsReady();
  const device = useUbidotsSelectedDevice();

  return (
    <div>
      {ready ? (
        <div>
          <h3>Device Information</h3>
          <p>Device: {device?.name || 'No device selected'}</p>
        </div>
      ) : (
        <div>
          <p>🔄 Initializing...</p>
          <p>Waiting for Ubidots connection</p>
        </div>
      )}
    </div>
  );
}
```

### With Loading States

```tsx
import { useUbidotsReady } from '@ubidots/react-html-canvas';

function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const ready = useUbidotsReady();

  if (!ready) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <div>
          <div className='spinner' />
          <p>Connecting to Ubidots...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

## Ready Events Configuration

The ready state depends on the `readyEvents` configuration in the provider:

```tsx
// Wait only for token
<UbidotsProvider readyEvents={["receivedToken"]}>
  <App />
</UbidotsProvider>

// Wait for token and device selection
<UbidotsProvider readyEvents={["receivedToken", "selectedDevice"]}>
  <App />
</UbidotsProvider>

// Wait for multiple events
<UbidotsProvider readyEvents={[
  "receivedToken",
  "selectedDevice",
  "selectedDashboardDateRange"
]}>
  <App />
</UbidotsProvider>
```

## Available Ready Events

- `"receivedToken"` - Authentication token received
- `"receivedJWTToken"` - JWT token received
- `"selectedDevice"` - Device selected
- `"selectedDevices"` - Multiple devices selected
- `"selectedDashboardDateRange"` - Date range selected
- `"selectedDashboardObject"` - Dashboard object received
- `"selectedDeviceObject"` - Device object received
- `"isRealTimeActive"` - Real-time status received

## Best Practices

### 1. Always Check Ready State

```tsx
// ✅ Good - Check ready state before using other hooks
function MyWidget() {
  const ready = useUbidotsReady();
  const device = useUbidotsSelectedDevice();

  if (!ready) return <LoadingSpinner />;

  // Safe to use device data here
  return <DeviceInfo device={device} />;
}

// ❌ Bad - Using hooks without checking ready state
function MyWidget() {
  const device = useUbidotsSelectedDevice(); // Might be null

  return <DeviceInfo device={device} />; // Could cause errors
}
```

### 2. Provide Meaningful Loading States

```tsx
function MyWidget() {
  const ready = useUbidotsReady();

  if (!ready) {
    return (
      <div className='loading-state'>
        <h3>Initializing Widget</h3>
        <p>Connecting to Ubidots dashboard...</p>
        <ProgressBar />
      </div>
    );
  }

  return <WidgetContent />;
}
```

### 3. Handle Ready State Changes

```tsx
import { useEffect } from 'react';
import { useUbidotsReady } from '@ubidots/react-html-canvas';

function MyWidget() {
  const ready = useUbidotsReady();

  useEffect(() => {
    if (ready) {
      console.log('Ubidots system is now ready');
      // Initialize widget-specific logic
      initializeWidget();
    }
  }, [ready]);

  return ready ? <WidgetContent /> : <LoadingState />;
}
```

## Related Hooks

- [`useUbidotsSelectedDevice`](./useUbidotsSelectedDevice.md) - Get selected device
- [`useUbidotsActions`](./useUbidotsActions.md) - Perform dashboard actions
- [`useUbidotsAPI`](./useUbidotsAPI.md) - Get API client

## Related Components

- [`UbidotsProvider`](../UbidotsProvider.md) - Configure ready events

## Examples

- [Basic Usage Example](../../examples/basic-usage/) - Simple ready state handling
- [Complete Widget Example](../../examples/complete-widget/) - Advanced ready state management
