# Widget Events - Basic Example

This example demonstrates how to use **widget-specific V2 events** with the format `v2:widget:<event>:<widgetId>`.

## Features

- ✅ Emit widget lifecycle events (ready, loaded, error)
- 📡 Real-time event monitoring
- 🎯 Widget-specific event isolation
- 🔍 Event payload inspection

## Event Format

All widget events follow this pattern:

```
v2:widget:<eventType>:<widgetId>
```

### Examples:

- `v2:widget:ready:demo-widget-001`
- `v2:widget:loaded:demo-widget-001`
- `v2:widget:error:demo-widget-001`
- `v2:widget:settingsChanged:demo-widget-001`

## Usage

```jsx
import { UbidotsProvider, useWidgetEvents } from '@ubidots/react-html-canvas';

function MyWidget() {
  const { emitWidgetEvent } = useWidgetEvents();

  useEffect(() => {
    // Emit widget ready event
    emitWidgetEvent('ready', { status: 'ok' });
  }, []);

  return <div>Widget Content</div>;
}

export default function App() {
  return (
    <UbidotsProvider widgetId='my-widget-123'>
      <MyWidget />
    </UbidotsProvider>
  );
}
```

## Available Events

### Standard Widget Events

- **`ready`** - Widget is fully initialized and ready to use
- **`loaded`** - Widget has loaded its initial data
- **`error`** - Widget encountered an error
- **`settingsChanged`** - Widget settings were modified

### Custom Events

You can emit any custom event type:

```jsx
emitWidgetEvent('customAction', {
  action: 'export',
  format: 'csv',
});
// Emits: v2:widget:customAction:my-widget-123
```

## Listening for Widget Events

External applications can listen for widget events:

```javascript
window.addEventListener('message', event => {
  const { event: eventName, payload } = event.data;

  // Check if it's a widget event for a specific widget
  if (eventName === 'v2:widget:ready:my-widget-123') {
    console.log('Widget is ready!', payload);
  }

  // Or check for any widget event
  if (eventName.startsWith('v2:widget:')) {
    const [, , eventType, widgetId] = eventName.split(':');
    console.log(`Widget ${widgetId} emitted ${eventType}`, payload);
  }
});
```

## Key Concepts

### 1. Widget ID

Each widget must have a unique ID passed to the `UbidotsProvider`:

```jsx
<UbidotsProvider widgetId='unique-widget-id'>{/* ... */}</UbidotsProvider>
```

### 2. Event Isolation

Events are scoped to specific widgets using the widget ID. This allows:

- Multiple widgets on the same page without event conflicts
- Targeted event handling for specific widgets
- Better debugging and monitoring

### 3. Payload

Events can include any JSON-serializable payload:

```jsx
emitWidgetEvent('dataUpdated', {
  recordCount: 150,
  lastUpdate: new Date().toISOString(),
  source: 'api',
});
```

## Running the Example

1. Import the component in your application
2. Ensure the widget is running inside a Ubidots dashboard or has proper postMessage setup
3. Open browser DevTools to see events in the console
4. Click buttons to emit different widget events
5. Watch the event monitor update in real-time

## Notes

- Widget events are **V2 only** (no V1 equivalent)
- Events are sent via `window.postMessage` to the parent window
- The widget ID must be unique across all widgets in the dashboard
- Event payloads should be kept reasonably small for performance
