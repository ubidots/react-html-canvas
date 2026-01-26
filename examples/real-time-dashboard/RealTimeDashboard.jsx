import React, { useState, useEffect } from 'react';
import {
  UbidotsProvider,
  useUbidotsReady,
  useUbidotsRealTimeStatus,
  useUbidotsSelectedDevice,
  useUbidotsDashboardDateRange,
  useUbidotsActions,
} from '@ubidots/react-html-canvas';
import { EventEmitterPanel } from '../shared/EventEmitterPanel';
import './styles.css';

function RealTimeIndicator() {
  const realTimeStatus = useUbidotsRealTimeStatus();
  const { setRealTime } = useUbidotsActions();

  const getStatusColor = () => {
    if (realTimeStatus === null) return '#6c757d';
    return realTimeStatus ? '#28a745' : '#dc3545';
  };

  const getStatusText = () => {
    if (realTimeStatus === null) return 'Unknown';
    return realTimeStatus ? 'Active' : 'Inactive';
  };

  return (
    <div className='realtime-indicator'>
      <div
        className={`status-dot ${realTimeStatus ? 'status-dot-active' : ''}`}
        style={{ background: getStatusColor() }}
      />

      <span className='status-text'>
        <strong>Real-time Status:</strong> {getStatusText()}
      </span>

      <button
        onClick={() => setRealTime(!realTimeStatus)}
        className={`toggle-button ${realTimeStatus ? 'toggle-button-disable' : 'toggle-button-enable'}`}
      >
        {realTimeStatus ? 'Disable' : 'Enable'} Real-time
      </button>
    </div>
  );
}

function LiveDataStream() {
  const device = useUbidotsSelectedDevice();
  const realTimeStatus = useUbidotsRealTimeStatus();
  const [dataPoints, setDataPoints] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!device || !realTimeStatus) {
      setIsStreaming(false);
      return;
    }

    setIsStreaming(true);

    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      const newDataPoint = {
        timestamp: Date.now(),
        value: 20 + Math.random() * 15,
        variable: 'temperature',
      };

      setDataPoints(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-20);
      });
    }, 2000);

    return () => {
      // eslint-disable-next-line no-undef
      clearInterval(interval);
      setIsStreaming(false);
    };
  }, [device, realTimeStatus]);

  if (!device) {
    return (
      <div className='no-device'>
        <p>📱 Select a device to view real-time data</p>
      </div>
    );
  }

  return (
    <div className='card'>
      <div className='stream-header'>
        <h3>📊 Live Data Stream - {device.name || device.id}</h3>
        <div
          className={`stream-status ${isStreaming ? 'stream-status-active' : 'stream-status-inactive'}`}
        >
          {isStreaming ? '🟢 Streaming' : '🔴 Stopped'}
        </div>
      </div>

      {dataPoints.length === 0 ? (
        <div className='empty-state'>
          {realTimeStatus ? (
            <div>
              <div className='empty-icon'>⏳</div>
              <p>Waiting for real-time data...</p>
            </div>
          ) : (
            <div>
              <div className='empty-icon'>⏸️</div>
              <p>Enable real-time mode to see live data</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className='latest-value'>
            <div className='value-display'>
              {dataPoints[dataPoints.length - 1]?.value.toFixed(1)}°C
            </div>
            <div className='value-timestamp'>
              Last updated:{' '}
              {new Date(
                dataPoints[dataPoints.length - 1]?.timestamp
              ).toLocaleTimeString()}
            </div>
          </div>

          <div className='data-list'>
            {dataPoints
              .slice()
              .reverse()
              .map((point, index) => (
                <div
                  key={point.timestamp}
                  className={`data-item ${index === 0 ? 'data-item-latest' : ''}`}
                >
                  <span>{new Date(point.timestamp).toLocaleTimeString()}</span>
                  <span className='data-value'>{point.value.toFixed(2)}°C</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DateRangeInfo() {
  const dateRange = useUbidotsDashboardDateRange();
  const realTimeStatus = useUbidotsRealTimeStatus();

  if (realTimeStatus) {
    return (
      <div className='card date-range-realtime'>
        <h4>📅 Date Range</h4>
        <p>Real-time mode is active - showing live data as it arrives</p>
      </div>
    );
  }

  if (!dateRange) {
    return (
      <div className='card date-range-none'>
        <h4>📅 Date Range</h4>
        <p>No date range selected</p>
      </div>
    );
  }

  return (
    <div className='card date-range-historical'>
      <h4>📅 Historical Date Range</h4>
      <p>
        <strong>From:</strong> {new Date(dateRange.startTime).toLocaleString()}
      </p>
      <p>
        <strong>To:</strong> {new Date(dateRange.endTime).toLocaleString()}
      </p>
      <p>
        <strong>Duration:</strong>{' '}
        {Math.round(
          (dateRange.endTime - dateRange.startTime) / (1000 * 60 * 60)
        )}{' '}
        hours
      </p>
    </div>
  );
}

function RealTimeControls() {
  const { setRealTime, setDashboardDateRange } = useUbidotsActions();
  const realTimeStatus = useUbidotsRealTimeStatus();

  const setQuickDateRange = hours => {
    const now = Date.now();
    const start = now - hours * 60 * 60 * 1000;

    setDashboardDateRange({
      startTime: start,
      endTime: now,
    });
  };

  return (
    <div className='card'>
      <h3>🎛️ Real-time Controls</h3>

      <div className='controls-section'>
        <h4>Real-time Mode</h4>
        <div className='button-group'>
          <button
            onClick={() => setRealTime(true)}
            disabled={realTimeStatus === true}
            className='button button-success'
          >
            🟢 Enable Real-time
          </button>

          <button
            onClick={() => setRealTime(false)}
            disabled={realTimeStatus === false}
            className='button button-danger'
          >
            🔴 Disable Real-time
          </button>
        </div>
      </div>

      <div>
        <h4>Quick Historical Ranges</h4>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
          (Automatically disables real-time mode)
        </p>
        <div className='quick-ranges'>
          <button
            onClick={() => setQuickDateRange(1)}
            className='quick-range-button'
          >
            Last Hour
          </button>

          <button
            onClick={() => setQuickDateRange(6)}
            className='quick-range-button'
          >
            Last 6 Hours
          </button>

          <button
            onClick={() => setQuickDateRange(24)}
            className='quick-range-button'
          >
            Last 24 Hours
          </button>

          <button
            onClick={() => setQuickDateRange(168)}
            className='quick-range-button'
          >
            Last Week
          </button>
        </div>
      </div>
    </div>
  );
}

function RealTimeDashboard() {
  const ready = useUbidotsReady();

  if (!ready) {
    return (
      <div className='loading'>
        <div className='loading-content'>
          <div className='loading-icon'>🔄</div>
          <p>Initializing real-time dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard'>
      <RealTimeIndicator />

      <div className='main-grid'>
        <div>
          <LiveDataStream />
        </div>

        <div className='sidebar'>
          <DateRangeInfo />
          <RealTimeControls />
        </div>
      </div>
    </div>
  );
}

export function RealTimeDashboardExample() {
  return (
    <UbidotsProvider>
      <div className='container'>
        <header className='header'>
          <h1>⚡ Real-time Dashboard Example</h1>
          <p>Demonstrates real-time data streaming and controls</p>
        </header>

        <RealTimeDashboard />

        <div className='features-info'>
          <h3>💡 Real-time Features Demonstrated</h3>
          <ul className='features-list'>
            <li>
              ✅ Real-time status monitoring with useUbidotsRealTimeStatus
            </li>
            <li>✅ Live data streaming simulation</li>
            <li>✅ Real-time mode toggle controls</li>
            <li>✅ Date range information display</li>
            <li>✅ Quick historical range selection</li>
            <li>✅ Visual indicators for streaming status</li>
            <li>✅ Automatic data updates when real-time is active</li>
          </ul>
        </div>
        <EventEmitterPanel />
      </div>
    </UbidotsProvider>
  );
}

export default RealTimeDashboardExample;
