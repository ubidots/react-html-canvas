import React, { useState, useEffect } from 'react';
import {
  UbidotsProvider,
  useUbidotsReady,
  useUbidotsRealTimeStatus,
  useUbidotsSelectedDevice,
  useUbidotsDashboardDateRange,
  useUbidotsActions,
} from '@ubidots/react-html-canvas';

interface DataPoint {
  timestamp: number;
  value: number;
  variable: string;
}

function RealTimeIndicator() {
  const realTimeStatus = useUbidotsRealTimeStatus();
  const { setRealTime } = useUbidotsActions();

  const getStatusColor = () => {
    if (realTimeStatus === null) return '#6c757d'; // Gray for unknown
    return realTimeStatus ? '#28a745' : '#dc3545'; // Green for active, red for inactive
  };

  const getStatusText = () => {
    if (realTimeStatus === null) return 'Unknown';
    return realTimeStatus ? 'Active' : 'Inactive';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: getStatusColor(),
          marginRight: '10px',
          animation: realTimeStatus ? 'pulse 2s infinite' : 'none',
        }}
      />

      <span style={{ marginRight: '15px' }}>
        <strong>Real-time Status:</strong> {getStatusText()}
      </span>

      <button
        onClick={() => setRealTime(!realTimeStatus)}
        style={{
          padding: '5px 12px',
          background: realTimeStatus ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        {realTimeStatus ? 'Disable' : 'Enable'} Real-time
      </button>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function LiveDataStream() {
  const device = useUbidotsSelectedDevice();
  const realTimeStatus = useUbidotsRealTimeStatus();
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!device || !realTimeStatus) {
      setIsStreaming(false);
      return;
    }

    setIsStreaming(true);

    // Simulate real-time data stream
    const interval = setInterval(() => {
      const newDataPoint: DataPoint = {
        timestamp: Date.now(),
        value: 20 + Math.random() * 15, // Random temperature between 20-35°C
        variable: 'temperature',
      };

      setDataPoints(prev => {
        const updated = [...prev, newDataPoint];
        // Keep only last 20 points
        return updated.slice(-20);
      });
    }, 2000); // New data every 2 seconds

    return () => {
      clearInterval(interval);
      setIsStreaming(false);
    };
  }, [device?.id, realTimeStatus]);

  if (!device) {
    return (
      <div
        style={{ padding: '20px', textAlign: 'center', background: '#fff3cd' }}
      >
        <p>📱 Select a device to view real-time data</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <h3>📊 Live Data Stream - {device.name || device.id}</h3>
        <div
          style={{
            padding: '5px 10px',
            background: isStreaming ? '#d4edda' : '#f8d7da',
            color: isStreaming ? '#155724' : '#721c24',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {isStreaming ? '🟢 Streaming' : '🔴 Stopped'}
        </div>
      </div>

      {dataPoints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          {realTimeStatus ? (
            <div>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
              <p>Waiting for real-time data...</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏸️</div>
              <p>Enable real-time mode to see live data</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Latest Value Display */}
          <div
            style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}
            >
              {dataPoints[dataPoints.length - 1]?.value.toFixed(1)}°C
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Last updated:{' '}
              {new Date(
                dataPoints[dataPoints.length - 1]?.timestamp
              ).toLocaleTimeString()}
            </div>
          </div>

          {/* Data Points List */}
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid #eee',
              borderRadius: '4px',
            }}
          >
            {dataPoints
              .slice()
              .reverse()
              .map((point, index) => (
                <div
                  key={point.timestamp}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderBottom:
                      index < dataPoints.length - 1 ? '1px solid #eee' : 'none',
                    background: index === 0 ? '#e3f2fd' : 'transparent',
                  }}
                >
                  <span>{new Date(point.timestamp).toLocaleTimeString()}</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {point.value.toFixed(2)}°C
                  </span>
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
      <div
        style={{
          background: '#d1ecf1',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #bee5eb',
        }}
      >
        <h4>📅 Date Range</h4>
        <p>Real-time mode is active - showing live data as it arrives</p>
      </div>
    );
  }

  if (!dateRange) {
    return (
      <div
        style={{
          background: '#fff3cd',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #ffeaa7',
        }}
      >
        <h4>📅 Date Range</h4>
        <p>No date range selected</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#d4edda',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #c3e6cb',
      }}
    >
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

  const setQuickDateRange = (hours: number) => {
    const now = Date.now();
    const start = now - hours * 60 * 60 * 1000;

    setDashboardDateRange({
      startTime: start,
      endTime: now,
    });
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <h3>🎛️ Real-time Controls</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>Real-time Mode</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setRealTime(true)}
            disabled={realTimeStatus === true}
            style={{
              padding: '8px 16px',
              background: realTimeStatus === true ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: realTimeStatus === true ? 'not-allowed' : 'pointer',
            }}
          >
            🟢 Enable Real-time
          </button>

          <button
            onClick={() => setRealTime(false)}
            disabled={realTimeStatus === false}
            style={{
              padding: '8px 16px',
              background: realTimeStatus === false ? '#ccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: realTimeStatus === false ? 'not-allowed' : 'pointer',
            }}
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setQuickDateRange(1)}
            style={{
              padding: '6px 12px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Last Hour
          </button>

          <button
            onClick={() => setQuickDateRange(6)}
            style={{
              padding: '6px 12px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Last 6 Hours
          </button>

          <button
            onClick={() => setQuickDateRange(24)}
            style={{
              padding: '6px 12px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Last 24 Hours
          </button>

          <button
            onClick={() => setQuickDateRange(168)}
            style={{
              padding: '6px 12px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          <p>Initializing real-time dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <RealTimeIndicator />

      <div
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}
      >
        <div>
          <LiveDataStream />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <DateRangeInfo />
          <RealTimeControls />
        </div>
      </div>
    </div>
  );
}

export function RealTimeDashboardExample() {
  return (
    <UbidotsProvider readyEvents={['receivedToken']}>
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <header
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <h1>⚡ Real-time Dashboard Example</h1>
          <p>Demonstrates real-time data streaming and controls</p>
        </header>

        <RealTimeDashboard />

        <div
          style={{
            background: '#e9ecef',
            padding: '20px',
            margin: '20px',
            borderRadius: '8px',
          }}
        >
          <h3>💡 Real-time Features Demonstrated</h3>
          <ul>
            <li>
              ✅ Real-time status monitoring with{' '}
              <code>useUbidotsRealTimeStatus</code>
            </li>
            <li>✅ Live data streaming simulation</li>
            <li>✅ Real-time mode toggle controls</li>
            <li>✅ Date range information display</li>
            <li>✅ Quick historical range selection</li>
            <li>✅ Visual indicators for streaming status</li>
            <li>✅ Automatic data updates when real-time is active</li>
          </ul>
        </div>
      </div>
    </UbidotsProvider>
  );
}

export default RealTimeDashboardExample;
