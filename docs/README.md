# Documentation

Complete documentation for `@ubidots/react-html-canvas` library.

## 📚 API Reference

### Provider

- [**UbidotsProvider**](./UbidotsProvider.md) - Main provider component

### Hooks

#### Available Hooks

- [**useUbidotsReady**](./hooks/useUbidotsReady.md) - Ready state management
- [**useUbidotsActions**](./hooks/useUbidotsActions.md) - Dashboard actions
- [**useUbidotsAPI**](./hooks/useUbidotsAPI.md) - API client
- [**useUbidotsSelectedDevice**](./hooks/useUbidotsSelectedDevice.md) - Single device selection

#### Other Hooks (Documentation Coming Soon)

The following hooks are available in the library but documentation is being prepared:

- **useUbidotsToken** - Authentication token
- **useUbidotsJWT** - JWT token
- **useUbidotsSelectedDevices** - Multiple device selection
- **useUbidotsDashboardDateRange** - Date range handling
- **useUbidotsRealTimeStatus** - Real-time status
- **useUbidotsDeviceObject** - Device object data
- **useUbidotsDashboardObject** - Dashboard object data
- **useUbidotsWidget** - Widget information

## 🎯 Guides

Comprehensive guides are being prepared. For now, please refer to the [examples folder](../examples/) for practical usage patterns.

## 🔧 Types

TypeScript type definitions are available in the library. Detailed type documentation is being prepared.

## 📖 Examples

See the [examples folder](../examples/) for complete working examples:

- [Basic Usage](../examples/basic-usage/) - Simple setup and usage
- [Device Selector](../examples/device-selector/) - Interactive device selection
- [Real-time Dashboard](../examples/real-time-dashboard/) - Live data streaming and controls
- [Complete Widget](../examples/complete-widget/) - Comprehensive example testing all features
- [With HOCs](../examples/with-hocs/) - Higher-Order Components usage

## 🚀 Quick Reference

### Basic Setup

```tsx
import {
  UbidotsProvider,
  useUbidotsReady,
  useUbidotsSelectedDevice,
} from '@ubidots/react-html-canvas';

function MyWidget() {
  const ready = useUbidotsReady();
  const device = useUbidotsSelectedDevice();

  if (!ready) return <div>Loading...</div>;

  return <div>Device: {device?.name}</div>;
}

function App() {
  return (
    <UbidotsProvider readyEvents={['receivedToken']}>
      <MyWidget />
    </UbidotsProvider>
  );
}
```

### Common Actions

```tsx
import { useUbidotsActions } from '@ubidots/react-html-canvas';

function Controls() {
  const { setDashboardDevice, refreshDashboard, setRealTime } =
    useUbidotsActions();

  return (
    <div>
      <button onClick={() => setDashboardDevice('device-id')}>
        Select Device
      </button>
      <button onClick={refreshDashboard}>Refresh</button>
      <button onClick={() => setRealTime(true)}>Enable Real-time</button>
    </div>
  );
}
```

## 🔍 Search

Use your browser's search (Ctrl/Cmd + F) to quickly find specific hooks, types, or concepts in this documentation.
