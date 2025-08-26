# Complete Widget Example

This is the most comprehensive example that demonstrates **ALL** features of `@ubidots/react-html-canvas`.

## What it tests

### Hooks

- ✅ `useUbidotsReady` - Ready state management
- ✅ `useUbidotsToken` - Authentication token
- ✅ `useUbidotsJWT` - JWT token
- ✅ `useUbidotsSelectedDevice` - Single device selection
- ✅ `useUbidotsSelectedDevices` - Multiple device selection
- ✅ `useUbidotsDashboardDateRange` - Date range handling
- ✅ `useUbidotsRealTimeStatus` - Real-time status
- ✅ `useUbidotsDeviceObject` - Device object data
- ✅ `useUbidotsDashboardObject` - Dashboard object data
- ✅ `useUbidotsWidget` - Widget information
- ✅ `useUbidotsActions` - All dashboard actions
- ✅ `useUbidotsAPI` - API client integration

### Actions

- ✅ `setDashboardDevice` - Set single device
- ✅ `setDashboardMultipleDevices` - Set multiple devices
- ✅ `setDashboardDateRange` - Set date range
- ✅ `setRealTime` - Toggle real-time mode
- ✅ `refreshDashboard` - Refresh dashboard
- ✅ `openDrawer` - Open side drawer
- ✅ `setFullScreen` - Control fullscreen mode
- ✅ `getHeaders` - Get authentication headers

### Provider Features

- ✅ Custom ready events configuration
- ✅ Origin validation
- ✅ Ready callback
- ✅ Initial state override

## Usage

```tsx
import { CompleteWidget } from './CompleteWidget';

function App() {
  return <CompleteWidget />;
}
```

This example is perfect for:

- Testing all library functionality
- Understanding the complete API
- Reference implementation
- Integration testing
