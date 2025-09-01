import React, { useState } from 'react';
import {
  UbidotsProvider,
  useUbidotsReady,
  useUbidotsSelectedDevice,
  useUbidotsSelectedDevices,
  useUbidotsActions,
} from '@ubidots/react-html-canvas';
import './styles.css';

function DeviceCard({ device, isSelected, onSelect }) {
  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role='button'
      tabIndex={0}
      className={`device-card ${isSelected ? 'device-card-selected' : 'device-card-unselected'}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <h4
        className={`device-title ${isSelected ? 'device-title-selected' : ''}`}
      >
        {device.name || device.label || `Device ${device.id}`}
      </h4>
      <p className='device-info'>
        <strong>ID:</strong> {device.id}
      </p>
      {device.description && (
        <p className='device-info'>
          <strong>Description:</strong> {device.description}
        </p>
      )}
      <div
        className={`device-status ${isSelected ? 'device-status-selected' : 'device-status-unselected'}`}
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
  const [localSelectedDevices, setLocalSelectedDevices] = useState([]);

  if (!ready) {
    return (
      <div className='loading'>
        <p>🔄 Initializing device selector...</p>
      </div>
    );
  }

  const handleSingleDeviceSelect = deviceId => {
    if (!multiSelectMode) {
      setDashboardDevice(deviceId);
    }
  };

  const handleMultiDeviceToggle = deviceId => {
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
    <div className='content'>
      <div className='section-header'>
        <h2>📱 Device Selector</h2>
        <p className='section-description'>
          Select devices to monitor in your dashboard
        </p>
      </div>

      <div className='current-selection'>
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
            <ul className='selection-list'>
              {selectedDevices.map(device => (
                <li key={device.id}>{device.name || device.id}</li>
              ))}
            </ul>
          </div>
        )}
        {!selectedDevice &&
          (!selectedDevices || selectedDevices.length === 0) && (
            <p className='no-selection'>No devices selected</p>
          )}
      </div>

      <div className='mode-controls'>
        <button
          onClick={() => setMultiSelectMode(!multiSelectMode)}
          className={`button ${multiSelectMode ? 'button-multi-cancel' : 'button-multi-toggle'}`}
        >
          {multiSelectMode ? '❌ Cancel Multi-Select' : '✅ Multi-Select Mode'}
        </button>

        {multiSelectMode && (
          <>
            <button
              onClick={applyMultiSelection}
              disabled={localSelectedDevices.length === 0}
              className='button button-apply'
            >
              Apply Selection ({localSelectedDevices.length})
            </button>
            <button
              onClick={cancelMultiSelection}
              className='button button-cancel'
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <div className='device-grid'>
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
        <div className='floating-panel'>
          <p className='floating-panel-text'>
            {localSelectedDevices.length} device(s) selected
          </p>
          <button
            onClick={applyMultiSelection}
            disabled={localSelectedDevices.length === 0}
            className='floating-panel-button'
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
    <UbidotsProvider>
      <div className='container'>
        <header className='header'>
          <h1>📱 Device Selector Example</h1>
          <p>Interactive device selection with single and multi-select modes</p>
        </header>
        <DeviceSelector />
      </div>
    </UbidotsProvider>
  );
}

export default DeviceSelectorExample;
