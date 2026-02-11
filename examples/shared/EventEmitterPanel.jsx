import React, { useState } from 'react';
import './EventEmitterPanel.css';

export function EventEmitterPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [lastEmitted, setLastEmitted] = useState('');

  // Get widgetId from window if available, otherwise use a demo ID
  const widgetId =
    // eslint-disable-next-line no-undef
    (typeof window !== 'undefined' && window.widgetId) || 'demo-widget-001';

  const emitEvent = (eventName, payload) => {
    const message = { event: eventName, payload };
    // eslint-disable-next-line no-undef
    window.parent.postMessage(message, '*');
    setLastEmitted(`${eventName} - ${new Date().toLocaleTimeString()}`);
  };

  const events = [
    {
      category: '⚡ System',
      items: [
        {
          name: 'Ready',
          event: 'ready',
          payload: { timestamp: Date.now() },
        },
      ],
    },
    {
      category: '🔐 Authentication',
      items: [
        {
          name: 'Token',
          event: 'receivedToken',
          payload: 'demo-token-12345',
        },
        {
          name: 'JWT Token',
          event: 'receivedJWTToken',
          payload: 'demo-jwt-token-67890',
        },
        {
          name: 'V2 Token',
          event: 'v2:auth:token',
          payload: 'demo-v2-token-abc',
        },
        {
          name: 'V2 JWT',
          event: 'v2:auth:jwt',
          payload: 'demo-v2-jwt-xyz',
        },
      ],
    },
    {
      category: '📱 Device Selection',
      items: [
        {
          name: 'Single Device',
          event: 'selectedDevice',
          payload: 'device-001',
        },
        {
          name: 'Multiple Devices',
          event: 'selectedDevices',
          payload: [
            { id: 'device-001', name: 'Sensor 1', label: 'S1' },
            { id: 'device-002', name: 'Sensor 2', label: 'S2' },
          ],
        },
        {
          name: 'V2 Self Device',
          event: 'v2:dashboard:devices:self',
          payload: { id: 'device-self', name: 'Self Device' },
        },
        {
          name: 'V2 Selected Devices',
          event: 'v2:dashboard:devices:selected',
          payload: [{ id: 'device-v2', name: 'V2 Device' }],
        },
      ],
    },
    {
      category: '📅 Date & Time',
      items: [
        {
          name: 'Date Range',
          event: 'selectedDashboardDateRange',
          payload: {
            startTime: Date.now() - 86400000,
            endTime: Date.now(),
          },
        },
        {
          name: 'V2 Date Range',
          event: 'v2:dashboard:settings:daterange',
          payload: {
            startTime: Date.now() - 3600000,
            endTime: Date.now(),
          },
        },
        {
          name: 'Real-time ON',
          event: 'isRealTimeActive',
          payload: true,
        },
        {
          name: 'Real-time OFF',
          event: 'isRealTimeActive',
          payload: false,
        },
        {
          name: 'V2 Real-time',
          event: 'v2:dashboard:settings:rt',
          payload: true,
        },
      ],
    },
    {
      category: '🎛️ Dashboard Objects',
      items: [
        {
          name: 'Dashboard Object',
          event: 'selectedDashboardObject',
          payload: { id: 'dash-001', name: 'Main Dashboard' },
        },
        {
          name: 'Device Object',
          event: 'selectedDeviceObject',
          payload: { id: 'dev-obj-001', name: 'Device Config' },
        },
        {
          name: 'V2 Dashboard Self',
          event: 'v2:dashboard:self',
          payload: { id: 'dash-v2', name: 'V2 Dashboard' },
        },
      ],
    },
    {
      category: '🔄 Dashboard Actions',
      items: [
        {
          name: 'Refresh Dashboard',
          event: 'v2:dashboard:settings:refreshed',
          payload: { timestamp: Date.now() },
        },
      ],
    },
    {
      category: '🎨 Filters',
      items: [
        {
          name: 'Selected Filters',
          event: 'selectedFilters',
          payload: [
            { key: 'status', value: 'active' },
            { key: 'type', value: 'sensor' },
          ],
        },
        {
          name: 'V2 Filters',
          event: 'v2:dashboard:settings:filters',
          payload: [{ filter: 'location', value: 'warehouse-1' }],
        },
      ],
    },
    {
      category: '🔧 Widget Events',
      items: [
        {
          name: 'Widget Ready',
          event: `v2:widget:ready:${widgetId}`,
          payload: {
            status: 'ok',
            features: ['charts', 'realtime', 'export'],
            timestamp: Date.now(),
          },
        },
        {
          name: 'Widget Loaded',
          event: `v2:widget:loaded:${widgetId}`,
          payload: {
            timestamp: Date.now(),
            version: '1.0.0',
          },
        },
        {
          name: 'Widget Error',
          event: `v2:widget:error:${widgetId}`,
          payload: {
            code: 'DEMO_ERROR',
            message: 'This is a simulated error',
            timestamp: Date.now(),
          },
        },
        {
          name: 'Custom Action',
          event: `v2:widget:customAction:${widgetId}`,
          payload: {
            action: 'export',
            format: 'csv',
            timestamp: Date.now(),
          },
        },
      ],
    },
  ];

  const handleHeaderClick = () => setIsOpen(!isOpen);
  const handleHeaderKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`event-panel ${isOpen ? 'open' : 'closed'}`}>
      <div
        className='event-panel-header'
        onClick={handleHeaderClick}
        onKeyDown={handleHeaderKeyDown}
        role='button'
        tabIndex={0}
        aria-label={isOpen ? 'Minimize panel' : 'Maximize panel'}
      >
        <h3>📡 Event Emitter</h3>
        <button
          className='toggle-btn'
          onClick={e => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          title={isOpen ? 'Minimize' : 'Maximize'}
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>

      {isOpen && (
        <div className='event-panel-content'>
          {lastEmitted && (
            <div className='last-emitted'>
              <small>Last: {lastEmitted}</small>
            </div>
          )}

          <div className='event-categories'>
            {events.map((category, idx) => (
              <div key={idx} className='event-category'>
                <h4>{category.category}</h4>
                <div className='event-buttons'>
                  {category.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      className='event-btn'
                      onClick={() => emitEvent(item.event, item.payload)}
                      title={`Emit ${item.event}`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
