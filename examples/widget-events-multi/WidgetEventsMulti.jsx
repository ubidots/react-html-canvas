import React, { useEffect, useState } from 'react';
import {
  UbidotsProvider,
  useUbidotsReady,
  useWidgetEvents,
} from '@ubidots/react-html-canvas';
import { EventEmitterPanel } from '../shared/EventEmitterPanel';
import './styles.css';

/**
 * Example demonstrating multiple widgets with isolated events
 *
 * This example shows:
 * 1. Multiple widgets on the same page
 * 2. Each widget has its own event namespace
 * 3. Widgets can communicate with each other via events
 * 4. Event isolation prevents cross-widget interference
 */

function GlobalEventMonitor() {
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    function handleMessage(ev) {
      const { event, payload } = ev.data || {};

      // Log all widget events
      if (event && event.startsWith('v2:widget:')) {
        const timestamp = new Date().toLocaleTimeString();
        const parts = event.split(':');
        const eventType = parts[2];
        const widgetId = parts[3];

        setAllEvents(prev =>
          [{ timestamp, event, eventType, widgetId, payload }, ...prev].slice(
            0,
            20
          )
        ); // Keep last 20 events
      }
    }

    // eslint-disable-next-line no-undef
    window.addEventListener('message', handleMessage);
    // eslint-disable-next-line no-undef
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className='global-monitor'>
      <h2>🌐 Global Event Monitor</h2>
      <p className='monitor-subtitle'>All widget events across the page</p>

      <div className='event-stream'>
        {allEvents.length === 0 ? (
          <div className='no-events'>
            No events yet. Interact with widgets below.
          </div>
        ) : (
          allEvents.map((e, i) => (
            <div key={i} className='event-row'>
              <span className='event-time'>{e.timestamp}</span>
              <span className={`widget-badge widget-${e.widgetId}`}>
                {e.widgetId}
              </span>
              <span className='event-name'>{e.eventType}</span>
              <span className='event-data'>{JSON.stringify(e.payload)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Widget({ widgetId, color }) {
  const ready = useUbidotsReady();
  const { emitWidgetEvent } = useWidgetEvents();
  const [messageCount, setMessageCount] = useState(0);
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    if (ready) {
      emitWidgetEvent('ready', { color, timestamp: Date.now() });
    }
  }, [ready, emitWidgetEvent, color]);

  // Listen for messages from OTHER widgets
  useEffect(() => {
    function handleMessage(ev) {
      const { event, payload } = ev.data || {};

      // Only listen to 'message' events from OTHER widgets
      if (
        event &&
        event.startsWith('v2:widget:message:') &&
        !event.endsWith(`:${widgetId}`)
      ) {
        const senderWidgetId = event.split(':')[3];
        setReceivedMessages(prev =>
          [
            {
              from: senderWidgetId,
              text: payload.text,
              time: new Date().toLocaleTimeString(),
            },
            ...prev,
          ].slice(0, 5)
        );
      }
    }

    // eslint-disable-next-line no-undef
    window.addEventListener('message', handleMessage);
    // eslint-disable-next-line no-undef
    return () => window.removeEventListener('message', handleMessage);
  }, [widgetId]);

  const sendMessage = () => {
    const count = messageCount + 1;
    setMessageCount(count);

    emitWidgetEvent('message', {
      text: `Hello from ${widgetId}! (Message #${count})`,
      timestamp: Date.now(),
    });
  };

  const sendAction = () => {
    emitWidgetEvent('action', {
      type: 'buttonClick',
      widgetId,
      timestamp: Date.now(),
    });
  };

  if (!ready) {
    return <div className='widget-loading'>Loading...</div>;
  }

  return (
    <div className='widget-card' style={{ borderColor: color }}>
      <div className='widget-header' style={{ backgroundColor: color }}>
        <h3>{widgetId}</h3>
        <span className='widget-status'>● Ready</span>
      </div>

      <div className='widget-body'>
        <div className='widget-actions'>
          <button onClick={sendMessage} className='btn-send'>
            📤 Broadcast Message
          </button>
          <button onClick={sendAction} className='btn-action'>
            ⚡ Send Action
          </button>
        </div>

        <div className='message-counter'>
          Messages sent: <strong>{messageCount}</strong>
        </div>

        {receivedMessages.length > 0 && (
          <div className='received-messages'>
            <h4>📨 Received Messages</h4>
            {receivedMessages.map((msg, i) => (
              <div key={i} className='message-item'>
                <span className='message-time'>{msg.time}</span>
                <span className='message-from'>from {msg.from}:</span>
                <span className='message-text'>{msg.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WidgetWrapper({ widgetId, color }) {
  return (
    <UbidotsProvider widgetId={widgetId}>
      <Widget widgetId={widgetId} color={color} />
    </UbidotsProvider>
  );
}

export function WidgetEventsMulti() {
  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>🎭 Multi-Widget Events Example</h1>
        <p>Multiple widgets with isolated event namespaces</p>
      </header>

      <GlobalEventMonitor />

      <div className='widgets-grid'>
        <WidgetWrapper widgetId='widget-alpha' color='#4CAF50' />
        <WidgetWrapper widgetId='widget-beta' color='#2196F3' />
        <WidgetWrapper widgetId='widget-gamma' color='#FF9800' />
      </div>

      <div className='info-panel'>
        <h3>💡 How it works</h3>
        <ul>
          <li>
            Each widget has its own <code>widgetId</code>
          </li>
          <li>
            Events are namespaced:{' '}
            <code>v2:widget:&lt;event&gt;:&lt;widgetId&gt;</code>
          </li>
          <li>Widgets can broadcast messages to all other widgets</li>
          <li>The global monitor shows all events from all widgets</li>
          <li>Each widget only receives messages from OTHER widgets</li>
        </ul>
      </div>
      <EventEmitterPanel />
    </div>
  );
}

export default WidgetEventsMulti;
