# useWidgetEvents

Hook that gives a widget its own data (`onInfo` / `onData`), its lifecycle events, and widget-to-widget events.

## Signature

```tsx
function useWidgetEvents(widgetId?: string): {
  onInfo: (cb: (payload: unknown) => void) => () => void;
  onData: (cb: (payload: unknown) => void) => () => void;
  onReady: (cb: (payload: unknown) => void) => () => void;
  onError: (cb: (payload: unknown) => void) => () => void;
  emitWidgetEvent: (event: string, payload?: unknown) => void;
  onWidgetEvent: (event: string, cb: (payload: unknown) => void) => () => void;
  onAnyWidgetEvent: (cb: (event: string, payload: unknown) => void) => () => void;
  widgetId: string | undefined;
};
```

## Description

Widget events are namespaced per widget: `v2:widget:<event>:<widgetId>`. The widget id comes from the `widgetId` argument, or else from the `widgetId` prop of [`UbidotsProvider`](../UbidotsProvider.md). Without a widget id, `onInfo` / `onData` / `onReady` / `onError` never fire, and `emitWidgetEvent` only logs a warning.

Every `on*` function returns an unsubscribe function. Return it from your `useEffect`.

When the provider is ready, the hook emits `v2:widget:ready:<widgetId>` with `{ widgetId, timestamp }`.

## Returns

| Field | Description |
| --- | --- |
| `onInfo(cb)` | The widget's descriptors (`v2:widget:info:<widgetId>`). Fires on load and whenever the widget's settings or devices change. |
| `onData(cb)` | The widget's values (`v2:widget:data:<widgetId>`). Fires on load and on every real-time tick. |
| `onReady(cb)` | `v2:widget:ready:<widgetId>`. |
| `onError(cb)` | `v2:widget:error:<widgetId>`. |
| `emitWidgetEvent(event, payload)` | Posts `v2:widget:<event>:<widgetId>` to the dashboard, with this widget's id. |
| `onWidgetEvent(event, cb)` | Calls `cb(payload)` for an event whose **full name** matches `event`. A name ending in `:*` matches as a prefix. |
| `onAnyWidgetEvent(cb)` | Calls `cb(event, payload)` for every `v2:widget:*` event. |
| `widgetId` | The widget id in use. |

### `onInfo` payload

```js
{
  templateId,
  variables: [{ id, label, name, unit, icon, color, aggregationMethod, span }],
  devices: [{ id, label, name }] // the devices that own the configured variables
}
```

### `onData` payload

```js
{
  start, // ISO 8601 string or undefined
  end, // ISO 8601 string or undefined
  results: [{ variableId, deviceId, value, timestamp }] // timestamp: epoch ms; value: number or null
}
```

Join values to descriptors by `results[].variableId === variables[].id`.

## Usage

### Render the configured variables

```tsx
import { useEffect, useState } from 'react';
import { useWidgetEvents } from '@ubidots/react-html-canvas';

function Widget() {
  const { onInfo, onData, onError } = useWidgetEvents();
  const [variables, setVariables] = useState([]);
  const [values, setValues] = useState({});

  useEffect(() => onInfo(p => setVariables(p?.variables ?? [])), [onInfo]);
  useEffect(
    () =>
      onData(p =>
        setValues(prev => {
          const next = { ...prev };
          for (const r of p?.results ?? []) next[r.variableId] = r;
          return next;
        })
      ),
    [onData]
  );
  useEffect(() => onError(() => {/* show a friendly message */}), [onError]);

  if (!variables.length) return <div>Loading…</div>;
  return variables.map(v => (
    <div key={v.id}>
      {v.label ?? v.name}: {values[v.id]?.value ?? '—'} {v.unit ?? ''}
    </div>
  ));
}
```

### Widget-to-widget events

The sender's id is part of the event name. To hear an event from any widget, subscribe with a wildcard:

```tsx
import { useEffect } from 'react';
import { useWidgetEvents } from '@ubidots/react-html-canvas';

function Highlighter() {
  const { emitWidgetEvent, onWidgetEvent } = useWidgetEvents();

  useEffect(
    () =>
      onWidgetEvent('v2:widget:highlight:*', payload => {
        /* react to payload */
      }),
    [onWidgetEvent]
  );

  return (
    <button onClick={() => emitWidgetEvent('highlight', { id: 1 })}>
      Ping
    </button>
  );
}
```

## Best Practices

- ✅ Subscribe with the full name (`'v2:widget:highlight:<senderId>'`) or a wildcard (`'v2:widget:highlight:*'`). ❌ `onWidgetEvent('highlight', cb)` never fires.
- ✅ Return the unsubscribe function from `useEffect`, so listeners don't pile up on re-render.
- ✅ Let `onData` drive real-time updates. Don't poll or open your own WebSocket.

## Related Hooks

- [`useUbidotsActions`](./useUbidotsActions.md) - Dashboard actions
- [`useUbidotsReady`](./useUbidotsReady.md) - Ready state
- [`useUbidotsSelectedDevice`](./useUbidotsSelectedDevice.md) - Selected device

## Examples

- [Complete Widget Example](../../examples/complete-widget/)
