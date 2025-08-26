# useUbidotsAPI

Hook that provides access to an authenticated Ubidots API client.

## Signature

```tsx
function useUbidotsAPI(): UbidotsJSClient | null;
```

## Description

The `useUbidotsAPI` hook returns a pre-authenticated Ubidots JavaScript SDK client that can be used to make API calls to the Ubidots platform. The client is automatically authenticated when a token becomes available.

## Returns

- `UbidotsJSClient | null` - An authenticated API client instance, or `null` if not available

## UbidotsJSClient Interface

```tsx
interface UbidotsJSClient {
  authenticate: (token: string) => void;
  // Additional SDK methods would be available here
  // This is a placeholder interface - actual SDK has more methods
}
```

## Usage

### Basic API Usage

```tsx
import { useUbidotsAPI, useUbidotsReady } from '@ubidots/react-html-canvas';

function ApiExample() {
  const api = useUbidotsAPI();
  const ready = useUbidotsReady();

  const makeApiCall = async () => {
    if (!api || !ready) {
      console.log('API client not ready');
      return;
    }

    try {
      // Use the authenticated API client
      // Note: Actual SDK methods depend on the Ubidots JS SDK
      console.log('API client is ready:', api);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  return (
    <div>
      <p>API Status: {api ? '✅ Ready' : '❌ Not available'}</p>
      <button onClick={makeApiCall} disabled={!api || !ready}>
        Make API Call
      </button>
    </div>
  );
}
```

### Combined with Manual API Calls

```tsx
import {
  useUbidotsAPI,
  useUbidotsActions,
  useUbidotsToken,
} from '@ubidots/react-html-canvas';

function HybridApiExample() {
  const api = useUbidotsAPI();
  const { getHeaders } = useUbidotsActions();
  const token = useUbidotsToken();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Method 1: Using the SDK client (when available)
  const fetchDevicesWithSDK = async () => {
    if (!api) {
      console.log('SDK not available');
      return;
    }

    setLoading(true);
    try {
      // Use SDK methods here
      // const devices = await api.getDevices()
      // setDevices(devices)
      console.log('Would use SDK client:', api);
    } catch (error) {
      console.error('SDK call failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Method 2: Using manual fetch with headers
  const fetchDevicesManually = async () => {
    if (!token) {
      console.log('No token available');
      return;
    }

    setLoading(true);
    try {
      const headers = getHeaders();
      const response = await fetch(
        'https://industrial.api.ubidots.com/api/v1.6/devices/',
        {
          method: 'GET',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDevices(data.results || []);
    } catch (error) {
      console.error('Manual API call failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>API Methods</h3>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={fetchDevicesWithSDK}
          disabled={!api || loading}
          style={{ marginRight: '10px' }}
        >
          {loading ? 'Loading...' : 'Fetch with SDK'}
        </button>

        <button onClick={fetchDevicesManually} disabled={!token || loading}>
          {loading ? 'Loading...' : 'Fetch Manually'}
        </button>
      </div>

      <div>
        <h4>Devices ({devices.length})</h4>
        {devices.map(device => (
          <div
            key={device.id}
            style={{ padding: '8px', border: '1px solid #ddd', margin: '4px' }}
          >
            {device.name || device.label} ({device.id})
          </div>
        ))}
      </div>
    </div>
  );
}
```

### API Status Monitoring

```tsx
import {
  useUbidotsAPI,
  useUbidotsToken,
  useUbidotsReady,
} from '@ubidots/react-html-canvas';

function ApiStatus() {
  const api = useUbidotsAPI();
  const token = useUbidotsToken();
  const ready = useUbidotsReady();

  const getStatusColor = () => {
    if (!ready) return '#ffc107'; // Yellow for loading
    if (!token) return '#dc3545'; // Red for no token
    if (!api) return '#fd7e14'; // Orange for no API client
    return '#28a745'; // Green for ready
  };

  const getStatusText = () => {
    if (!ready) return 'Initializing...';
    if (!token) return 'No authentication token';
    if (!api) return 'API client not available';
    return 'API ready';
  };

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '6px',
        background: getStatusColor(),
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      }}
    >
      🔌 API Status: {getStatusText()}
    </div>
  );
}
```

### Error Handling with API

```tsx
import { useUbidotsAPI } from '@ubidots/react-html-canvas';

function RobustApiComponent() {
  const api = useUbidotsAPI();
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const safeApiCall = async () => {
    setError(null);

    if (!api) {
      setError('API client not available');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData({
        message: 'API call successful',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setError(error.message || 'Unknown error occurred');
    }
  };

  return (
    <div>
      <button onClick={safeApiCall} disabled={!api}>
        Make Safe API Call
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>❌ Error: {error}</div>
      )}

      {data && (
        <div style={{ color: 'green', marginTop: '10px' }}>
          ✅ Success: {JSON.stringify(data)}
        </div>
      )}
    </div>
  );
}
```

### API Client Lifecycle

```tsx
import { useEffect } from 'react';
import { useUbidotsAPI, useUbidotsToken } from '@ubidots/react-html-canvas';

function ApiLifecycleExample() {
  const api = useUbidotsAPI();
  const token = useUbidotsToken();

  useEffect(() => {
    if (api && token) {
      console.log('API client is ready and authenticated');

      // Perform initial setup
      initializeApiClient();
    }
  }, [api, token]);

  const initializeApiClient = () => {
    console.log('Initializing API client...');
    // Set up any client-specific configuration
    // Subscribe to real-time events
    // Cache frequently used data
  };

  return (
    <div>
      <h3>API Client Lifecycle</h3>
      <p>Token: {token ? '✅ Available' : '❌ Missing'}</p>
      <p>API Client: {api ? '✅ Ready' : '❌ Not available'}</p>

      {api && token && (
        <div style={{ color: 'green' }}>
          🎉 API client is fully initialized and ready to use!
        </div>
      )}
    </div>
  );
}
```

## Best Practices

### 1. Always Check API Availability

```tsx
// ✅ Good - Check API availability
function ApiComponent() {
  const api = useUbidotsAPI();

  const makeCall = async () => {
    if (!api) {
      console.log('API not available');
      return;
    }

    // Safe to use API
  };

  return (
    <button onClick={makeCall} disabled={!api}>
      Call API
    </button>
  );
}

// ❌ Bad - Assuming API exists
function ApiComponent() {
  const api = useUbidotsAPI();

  const makeCall = async () => {
    api.someMethod(); // Could throw error if api is null
  };

  return <button onClick={makeCall}>Call API</button>;
}
```

### 2. Combine with Ready State

```tsx
function SafeApiComponent() {
  const api = useUbidotsAPI();
  const ready = useUbidotsReady();

  const isApiReady = api && ready;

  return (
    <div>
      <p>Status: {isApiReady ? 'Ready' : 'Not ready'}</p>
      <button disabled={!isApiReady}>Make API Call</button>
    </div>
  );
}
```

### 3. Handle Authentication States

```tsx
function AuthAwareApiComponent() {
  const api = useUbidotsAPI();
  const token = useUbidotsToken();

  if (!token) {
    return <div>Waiting for authentication...</div>;
  }

  if (!api) {
    return <div>Initializing API client...</div>;
  }

  return <div>API ready for use!</div>;
}
```

### 4. Fallback to Manual API Calls

```tsx
function FlexibleApiComponent() {
  const api = useUbidotsAPI();
  const { getHeaders } = useUbidotsActions();

  const makeApiCall = async () => {
    if (api) {
      // Prefer SDK when available
      return useSDKMethod();
    } else {
      // Fallback to manual fetch
      return useManualFetch();
    }
  };

  const useSDKMethod = async () => {
    // Use SDK client
    console.log('Using SDK client');
  };

  const useManualFetch = async () => {
    const headers = getHeaders();
    // Use fetch with headers
    console.log('Using manual fetch with headers:', headers);
  };

  return <button onClick={makeApiCall}>Flexible API Call</button>;
}
```

## Related Hooks

- [`useUbidotsActions`](./useUbidotsActions.md) - Get authentication headers
- [`useUbidotsReady`](./useUbidotsReady.md) - Check if system is ready
- [`useUbidotsSelectedDevice`](./useUbidotsSelectedDevice.md) - Get selected device

## Related Types

TypeScript type definitions are available in the library. Detailed type documentation is being prepared.

## Examples

- [Complete Widget Example](../../examples/complete-widget/) - API client in context

## Notes

- The API client is automatically authenticated when a token becomes available
- The actual SDK methods depend on the Ubidots JavaScript SDK implementation
- Consider using manual fetch calls with `getHeaders()` for more control
- Always handle cases where the API client might not be available
