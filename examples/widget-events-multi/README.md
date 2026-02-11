# Widget Events - Multi Widget Example

This example demonstrates multiple widgets on the same page, each with isolated event namespaces using the `v2:widget:<event>:<widgetId>` pattern.

## Features

- 🎭 Multiple independent widgets on the same page
- 🔒 Event isolation per widget using unique IDs
- 📡 Inter-widget communication via broadcast events
- 🌐 Global event monitoring across all widgets
- 🎯 Selective event listening (widgets ignore their own events)

## Event Isolation

Each widget has its own event namespace:

```
Widget Alpha: v2:widget:<event>:widget-alpha
Widget Beta:  v2:widget:<event>:widget-beta
Widget Gamma: v2:widget:<event>:widget-gamma
```

This prevents event conflicts and allows widgets to:

- Emit events without affecting other widgets
- Listen for events from specific widgets
- Broadcast messages to all other widgets

## Architecture

```
┌─────────────────────────────────────────┐
│      Global Event Monitor               │
│  (Listens to all v2:widget:* events)   │
└─────────────────────────────────────────┘
                    ▲
                    │
        ┌───────────┼───────────┐
        │           │           │
   ┌────▼────┐ ┌───▼─────┐ ┌──▼──────┐
   │ Widget  │ │ Widget  │ │ Widget  │
   │  Alpha  │ │  Beta   │ │  Gamma  │
   └─────────┘ └─────────┘ └─────────┘
```

## Usage

### Basic Setup

```jsx
import { UbidotsProvider, useWidgetEvents } from '@ubidots/react-html-canvas';

function Widget({ widgetId }) {
  const { emitWidgetEvent } = useWidgetEvents();

  const sendMessage = () => {
    emitWidgetEvent('message', {
      text: `Hello from ${widgetId}`,
    });
  };

  return <button onClick={sendMessage}>Send Message</button>;
}

// Each widget needs its own Provider with unique widgetId
function App() {
  return (
    <>
      <UbidotsProvider widgetId='widget-1'>
        <Widget widgetId='widget-1' />
      </UbidotsProvider>

      <UbidotsProvider widgetId='widget-2'>
        <Widget widgetId='widget-2' />
      </UbidotsProvider>
    </>
  );
}
```

### Inter-Widget Communication

Widgets can listen for events from other widgets:

```jsx
function Widget({ widgetId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    function handleMessage(ev) {
      const { event, payload } = ev.data || {};

      // Listen for 'message' events from OTHER widgets
      if (
        event &&
        event.startsWith('v2:widget:message:') &&
        !event.endsWith(`:${widgetId}`)
      ) {
        const senderWidgetId = event.split(':')[3];
        setMessages(prev => [
          ...prev,
          {
            from: senderWidgetId,
            text: payload.text,
          },
        ]);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [widgetId]);

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>
          From {msg.from}: {msg.text}
        </div>
      ))}
    </div>
  );
}
```

## Event Flow Example

When Widget Alpha sends a message:

```
1. Widget Alpha calls: emitWidgetEvent('message', { text: 'Hello' })
2. Event emitted: v2:widget:message:widget-alpha
3. Global Monitor receives and displays the event
4. Widget Beta receives the event (different widgetId)
5. Widget Gamma receives the event (different widgetId)
6. Widget Alpha ignores it (same widgetId)
```

## Key Concepts

### 1. Unique Widget IDs

Each widget MUST have a unique `widgetId`:

```jsx
<UbidotsProvider widgetId='unique-id-here'>
  <MyWidget />
</UbidotsProvider>
```

### 2. Event Filtering

Widgets can filter events by:

- **Event type**: `v2:widget:message:*`
- **Widget ID**: `v2:widget:*:widget-alpha`
- **Both**: `v2:widget:message:widget-alpha`

### 3. Broadcast Pattern

To broadcast to all widgets:

```jsx
// Sender
emitWidgetEvent('broadcast', { data: 'for everyone' });

// Receivers (all other widgets)
if (
  event.startsWith('v2:widget:broadcast:') &&
  !event.endsWith(`:${myWidgetId}`)
) {
  // Handle broadcast
}
```

## Use Cases

- **Dashboard with multiple charts**: Each chart is a widget that can update others
- **Collaborative tools**: Widgets share state changes
- **Event logging**: Central monitor tracks all widget activities
- **Widget orchestration**: One widget controls others

## Running the Example

```bash
pnpm install
pnpm dev
```

Then interact with the widgets to see:

- Events appearing in the global monitor
- Messages being received by other widgets
- Event isolation in action

## See Also

- [Widget Events - Basic Example](../widget-events-basic/) - Single widget events
- [Event Versioning Example](../event-versioning/) - V1/V2 compatibility
