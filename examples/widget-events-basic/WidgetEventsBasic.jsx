import React, { useEffect, useState } from 'react';
import {
  UbidotsProvider,
  useUbidotsReady,
  useWidgetEvents,
} from '@ubidots/react-html-canvas';
import { EventEmitterPanel } from '../shared/EventEmitterPanel';
import './styles.css';

/**
 * Example demonstrating Widget-specific V2 events
 *
 * This example shows:
 * 1. How to emit widget events with format: v2:widget:<event>:<widgetId>
 * 2. How to listen for widget-specific events
 * 3. Widget lifecycle events (ready, loaded, error)
 */

function EventMonitor({ widgetId }) {
  const [receivedEvents, setReceivedEvents] = useState([]);

  useEffect(() => {
    function handleMessage(ev) {
      const { event, payload } = ev.data || {};

      // Only log widget events for this specific widget
      if (
        event &&
        event.startsWith(`v2:widget:`) &&
        event.endsWith(`:${widgetId}`)
      ) {
        const timestamp = new Date().toLocaleTimeString();
        const eventType = event.split(':')[2]; // Extract event type

        setReceivedEvents(prev =>
          [{ timestamp, event, eventType, payload }, ...prev].slice(0, 15)
        ); // Keep last 15 events
      }
    }

    // eslint-disable-next-line no-undef
    window.addEventListener('message', handleMessage);
    // eslint-disable-next-line no-undef
    return () => window.removeEventListener('message', handleMessage);
  }, [widgetId]);

  return (
    <div className='event-monitor'>
      <h3>📡 Widget Event Monitor</h3>
      <p className='monitor-info'>
        Listening for: <code>v2:widget:*:{widgetId}</code>
      </p>

      <div className='event-list'>
        {receivedEvents.length === 0 ? (
          <div className='no-events'>No events received yet</div>
        ) : (
          receivedEvents.map((e, i) => (
            <div key={i} className='event-item'>
              <span className='event-time'>{e.timestamp}</span>
              <span className={`event-type event-type-${e.eventType}`}>
                {e.eventType}
              </span>
              <span className='event-payload'>{JSON.stringify(e.payload)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function WidgetContent({ widgetId }) {
  const ready = useUbidotsReady();
  const { emitWidgetEvent } = useWidgetEvents();
  const [status, setStatus] = useState('initializing');

  useEffect(() => {
    if (ready) {
      // Emit 'loaded' event when widget is ready
      emitWidgetEvent('loaded', {
        timestamp: Date.now(),
        version: '1.0.0',
      });
      setStatus('ready');
    }
  }, [ready, emitWidgetEvent]);

  const handleReady = () => {
    emitWidgetEvent('ready', {
      status: 'ok',
      features: ['charts', 'realtime', 'export'],
    });
    setStatus('active');
  };

  const handleError = () => {
    emitWidgetEvent('error', {
      code: 'DEMO_ERROR',
      message: 'This is a simulated error for demonstration',
    });
    setStatus('error');
  };

  const handleSettingsChange = () => {
    emitWidgetEvent('settingsChanged', {
      theme: 'dark',
      refreshInterval: 5000,
      showLegend: true,
    });
  };

  const handleCustomEvent = () => {
    emitWidgetEvent('customAction', {
      action: 'export',
      format: 'csv',
      timestamp: Date.now(),
    });
  };

  if (!ready) {
    return (
      <div className='loading'>
        <p>🔄 Initializing widget...</p>
      </div>
    );
  }

  return (
    <div className='widget-content'>
      <div className='status-bar'>
        <h3>
          Widget Status: <span className={`status-${status}`}>{status}</span>
        </h3>
        <p className='widget-id'>
          Widget ID: <code>{widgetId}</code>
        </p>
      </div>

      <div className='actions-section'>
        <h3>🎯 Emit Widget Events</h3>
        <p className='actions-info'>
          Click buttons to emit events with format:{' '}
          <code>v2:widget:&lt;event&gt;:{widgetId}</code>
        </p>

        <div className='button-grid'>
          <button onClick={handleReady} className='btn btn-success'>
            ✅ Emit &apos;ready&apos;
          </button>

          <button onClick={handleError} className='btn btn-danger'>
            ❌ Emit &apos;error&apos;
          </button>

          <button onClick={handleSettingsChange} className='btn btn-primary'>
            ⚙️ Emit &apos;settingsChanged&apos;
          </button>

          <button onClick={handleCustomEvent} className='btn btn-info'>
            🚀 Emit &apos;customAction&apos;
          </button>
        </div>
      </div>
    </div>
  );
}

export function WidgetEventsBasic() {
  const widgetId = 'widget-demo-001';

  return (
    <UbidotsProvider widgetId={widgetId}>
      <div className='container'>
        <header className='header'>
          <h1>🎨 Widget Events - Basic Example</h1>
          <p>Demonstrating V2 widget-specific events</p>
        </header>

        <div className='main-layout'>
          <div className='widget-panel'>
            <WidgetContent widgetId={widgetId} />
          </div>

          <div className='monitor-section'>
            <EventMonitor widgetId={widgetId} />
          </div>
        </div>
        <EventEmitterPanel />
      </div>
    </UbidotsProvider>
  );
}

export default WidgetEventsBasic;
