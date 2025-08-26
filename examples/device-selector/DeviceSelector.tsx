import React, { useState } from 'react';
import {
  UbidotsProvider,
  useUbidotsReady,
  useUbidotsSelectedDevice,
  useUbidotsSelectedDevices,
  useUbidotsActions,
} from '@ubidots/react-html-canvas';

interface DeviceCardProps {
  device: {
    id: string;
    name?: string;
    label?: string;
    description?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

function DeviceCard({ device, isSelected, onSelect }: DeviceCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role='button'
      tabIndex={0}
      style={{
        border: `2px solid ${isSelected ? '#007bff' : '#ddd'}`,
        borderRadius: '8px',
        padding: '15px',
        margin: '10px',
        cursor: 'pointer',
        background: isSelected ? '#f0f8ff' : '#fff',
        transition: 'all 0.2s ease',
      }}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <h4
        style={{ margin: '0 0 10px 0', color: isSelected ? '#007bff' : '#333' }}
      >
        {device.name || device.label || `Device ${device.id}`}
      </h4>
      <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
        <strong>ID:</strong> {device.id}
      </p>
      {device.description && (
        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
          <strong>Description:</strong> {device.description}
        </p>
      )}
      <div
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: isSelected ? '#007bff' : '#f8f9fa',
          color: isSelected ? 'white' : '#666',
          borderRadius: '4px',
          fontSize: '12px',
          textAlign: 'center',
        }}
      >
        {isSelected ? '✓ Selected' : 'Click to select'}
      </div>
    </div>
  );
}

function DeviceSelector() {
  const ready = useUbidotsReady();
  const selectedDevice = useUbidotsSelectedDevice();
  const selectedDevices = useUbidotsSelectedDevices();
  const { setDashboardDevice, setDashboardMultipleDevices } =
    useUbidotsActions();

  // Mock devices for demonstration
  const [availableDevices] = useState([
    {
      id: 'device-001',
      name: 'Temperature Sensor',
      description: 'Living room temperature monitoring',
    },
    {
      id: 'device-002',
      name: 'Humidity Sensor',
      description: 'Bathroom humidity control',
    },
    {
      id: 'device-003',
      name: 'Motion Detector',
      description: 'Front door security sensor',
    },
    {
      id: 'device-004',
      name: 'Light Controller',
      description: 'Smart lighting system',
    },
    {
      id: 'device-005',
      name: 'Energy Meter',
      description: 'Main electrical panel monitor',
    },
  ]);

  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [localSelectedDevices, setLocalSelectedDevices] = useState<string[]>(
    []
  );

  if (!ready) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>🔄 Initializing device selector...</p>
      </div>
    );
  }

  const handleSingleDeviceSelect = (deviceId: string) => {
    if (!multiSelectMode) {
      setDashboardDevice(deviceId);
    }
  };

  const handleMultiDeviceToggle = (deviceId: string) => {
    if (multiSelectMode) {
      setLocalSelectedDevices(prev =>
        prev.includes(deviceId)
          ? prev.filter(id => id !== deviceId)
          : [...prev, deviceId]
      );
    }
  };

  const applyMultiSelection = () => {
    setDashboardMultipleDevices(localSelectedDevices);
    setMultiSelectMode(false);
    setLocalSelectedDevices([]);
  };

  const cancelMultiSelection = () => {
    setMultiSelectMode(false);
    setLocalSelectedDevices([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>📱 Device Selector</h2>
        <p style={{ color: '#666' }}>
          Select devices to monitor in your dashboard
        </p>
      </div>

      {/* Current Selection Display */}
      <div
        style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3>Current Selection</h3>
        {selectedDevice && (
          <div>
            <p>
              <strong>Single Device:</strong>{' '}
              {selectedDevice.name || selectedDevice.id}
            </p>
          </div>
        )}
        {selectedDevices && selectedDevices.length > 0 && (
          <div>
            <p>
              <strong>Multiple Devices:</strong>
            </p>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {selectedDevices.map(device => (
                <li key={device.id}>{device.name || device.id}</li>
              ))}
            </ul>
          </div>
        )}
        {!selectedDevice &&
          (!selectedDevices || selectedDevices.length === 0) && (
            <p style={{ color: '#999' }}>No devices selected</p>
          )}
      </div>

      {/* Selection Mode Toggle */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setMultiSelectMode(!multiSelectMode)}
          style={{
            padding: '10px 20px',
            background: multiSelectMode ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          {multiSelectMode ? '❌ Cancel Multi-Select' : '✅ Multi-Select Mode'}
        </button>

        {multiSelectMode && (
          <>
            <button
              onClick={applyMultiSelection}
              disabled={localSelectedDevices.length === 0}
              style={{
                padding: '10px 20px',
                background:
                  localSelectedDevices.length > 0 ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor:
                  localSelectedDevices.length > 0 ? 'pointer' : 'not-allowed',
                marginRight: '10px',
              }}
            >
              Apply Selection ({localSelectedDevices.length})
            </button>
            <button
              onClick={cancelMultiSelection}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Device Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '10px',
        }}
      >
        {availableDevices.map(device => {
          const isSelected = multiSelectMode
            ? localSelectedDevices.includes(device.id)
            : selectedDevice?.id === device.id;

          return (
            <DeviceCard
              key={device.id}
              device={device}
              isSelected={isSelected}
              onSelect={() => {
                if (multiSelectMode) {
                  handleMultiDeviceToggle(device.id);
                } else {
                  handleSingleDeviceSelect(device.id);
                }
              }}
            />
          );
        })}
      </div>

      {multiSelectMode && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#007bff',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <p style={{ margin: '0 0 10px 0' }}>
            {localSelectedDevices.length} device(s) selected
          </p>
          <button
            onClick={applyMultiSelection}
            disabled={localSelectedDevices.length === 0}
            style={{
              padding: '8px 16px',
              background: 'white',
              color: '#007bff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Apply Selection
          </button>
        </div>
      )}
    </div>
  );
}

export function DeviceSelectorExample() {
  return (
    <UbidotsProvider readyEvents={['receivedToken']}>
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <header
          style={{
            background: '#343a40',
            color: 'white',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <h1>📱 Device Selector Example</h1>
          <p>Interactive device selection with single and multi-select modes</p>
        </header>
        <DeviceSelector />
      </div>
    </UbidotsProvider>
  );
}

export default DeviceSelectorExample;
