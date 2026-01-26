# Event Versioning (V1 & V2)

This library supports both V1 (legacy) and V2 event naming conventions for Ubidots dashboard communication.

## Overview

When V1 events are received or sent, the library **automatically emits the corresponding V2 events** as well. This ensures backward compatibility while supporting the new V2 event structure.

## Event Mapping

### Auth Events

| V1 Event           | V2 Event        | Description                   |
| ------------------ | --------------- | ----------------------------- |
| `receivedToken`    | `v2:auth:token` | Authentication token received |
| `receivedJWTToken` | `v2:auth:jwt`   | JWT token received            |

### Dashboard Events

| V1 Event                     | V2 Event                          | Description                                       |
| ---------------------------- | --------------------------------- | ------------------------------------------------- |
| `selectedDevice`             | `v2:dashboard:devices:selected`   | Single device selected (converted to array in V2) |
| `selectedDevices`            | `v2:dashboard:devices:selected`   | Multiple devices selected                         |
| `selectedDashboardDateRange` | `v2:dashboard:settings:daterange` | Date range selected                               |
| `selectedDashboardObject`    | `v2:dashboard:self`               | Dashboard object received                         |
| `selectedFilters`            | `v2:dashboard:settings:filters`   | Filters selected                                  |
| `isRealTimeActive`           | `v2:dashboard:settings:rt`        | Real-time status                                  |

### Outbound Events

| V1 Event                      | V2 Event                           | Description          |
| ----------------------------- | ---------------------------------- | -------------------- |
| `setDashboardDevice`          | `v2:dashboard:devices:selected`    | Set single device    |
| `setDashboardMultipleDevices` | `v2:dashboard:devices:selected`    | Set multiple devices |
| `setDashboardDateRange`       | `v2:dashboard:settings:daterange`  | Set date range       |
| `setRealTime`                 | `v2:dashboard:settings:rt`         | Set real-time mode   |
| `refreshDashboard`            | `v2:dashboard:settings:refreshed`  | Refresh dashboard    |
| `setFullScreen`               | `v2:dashboard:settings:fullscreen` | Set fullscreen mode  |
| `openDrawer`                  | `v2:dashboard:drawer:open`         | Open drawer          |

## How It Works

### Inbound Events (Receiving)

When the library receives a V1 event, it:

1. Processes the event normally (updates state, triggers callbacks)
2. **Automatically emits the corresponding V2 event** to the parent window

Example:

```typescript
// When 'receivedToken' arrives:
// 1. Updates state.token
// 2. Emits 'v2:auth:token' to parent window
```

The library can also receive V2 events directly and process them the same way.

### Outbound Events (Sending)

When you call an action (e.g., `setDashboardDevice`), the library:

1. Sends the V1 event to the parent window
2. **Automatically sends the corresponding V2 event** as well

Example:

```typescript
const { setDashboardDevice } = useUbidotsActions();

// This sends BOTH:
// - 'setDashboardDevice' with deviceId
// - 'v2:dashboard:devices:selected' with [{ id: deviceId }]
setDashboardDevice('device-123');
```

## Data Format Differences

### Single Device vs Array

V1 uses a single device or device ID string, while V2 always uses an array:

```typescript
// V1
setDashboardDevice('device-123');
// Sends: { event: 'setDashboardDevice', payload: 'device-123' }

// V2 (automatically sent)
// Sends: { event: 'v2:dashboard:devices:selected', payload: [{ id: 'device-123' }] }
```

## Usage

No changes are required in your code! The library handles V2 events automatically:

```tsx
import { UbidotsProvider, useUbidotsActions } from '@ubidots/react-html-canvas';

function MyWidget() {
  const { setDashboardDevice } = useUbidotsActions();

  // This automatically sends both V1 and V2 events
  const handleClick = () => {
    setDashboardDevice('device-123');
  };

  return <button onClick={handleClick}>Select Device</button>;
}

export default function App() {
  return (
    <UbidotsProvider>
      <MyWidget />
    </UbidotsProvider>
  );
}
```

## Ready Events

You can use either V1 or V2 event names in the `readyEvents` prop:

```tsx
// Using V1 events (legacy)
<UbidotsProvider readyEvents={['receivedToken', 'selectedDevice']}>
  <MyWidget />
</UbidotsProvider>

// Using V2 events
<UbidotsProvider readyEvents={['v2:auth:token', 'v2:dashboard:devices:selected']}>
  <MyWidget />
</UbidotsProvider>

// Mixing both (not recommended, but supported)
<UbidotsProvider readyEvents={['receivedToken', 'v2:dashboard:devices:selected']}>
  <MyWidget />
</UbidotsProvider>
```

## Migration Guide

If you're migrating from V1 to V2:

1. **No immediate action required** - V1 events continue to work
2. **Gradual migration** - Update your event listeners to use V2 event names
3. **Update readyEvents** - Switch to V2 event names in your `UbidotsProvider`
4. **Test thoroughly** - Ensure both V1 and V2 events are being received correctly

## Notes

- Widget events (`v2:widget:*`) are **not** automatically emitted by this library
- The library maintains full backward compatibility with V1 events
- Both V1 and V2 events can be received and processed simultaneously
