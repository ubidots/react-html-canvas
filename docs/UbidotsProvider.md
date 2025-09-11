# UbidotsProvider

The main provider component that wraps your application and provides Ubidots context to all child components.

## Signature

```tsx
function UbidotsProvider(props: UbidotsProviderProps): JSX.Element;
```

## Props

```tsx
interface UbidotsProviderProps {
  children: React.ReactNode;
  onReady?: () => void;
  readyEvents?: ReadyEvent[];
  validateOrigin?: (origin: string) => boolean;
  initialStateOverride?: Partial<UbidotsState>;
}
```

### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The child components that will have access to Ubidots context

### onReady

- **Type**: `() => void`
- **Required**: No
- **Description**: Callback function called when the system becomes ready

### readyEvents

- **Type**: `ReadyEvent[]`
- **Required**: No
- **Default**: `["receivedToken"]`
- **Description**: Array of events that must occur before the system is considered ready

### validateOrigin

- **Type**: `(origin: string) => boolean`
- **Required**: No
- **Description**: Function to validate message origins for security

### initialStateOverride

- **Type**: `Partial<UbidotsState>`
- **Required**: No
- **Description**: Override initial state values for testing or development

## Ready Events

Available ready events that can be configured:

- `"receivedToken"` - Authentication token received
- `"receivedJWTToken"` - JWT token received
- `"selectedDevice"` - Device selected
- `"selectedDevices"` - Multiple devices selected
- `"selectedDashboardDateRange"` - Date range selected
- `"selectedDashboardObject"` - Dashboard object received
- `"selectedDeviceObject"` - Device object received
- `"isRealTimeActive"` - Real-time status received

## Usage

### Basic Setup

```tsx
import { UbidotsProvider } from '@ubidots/react-html-canvas';

function App() {
  return (
    <UbidotsProvider>
      <MyWidget />
    </UbidotsProvider>
  );
}
```

### With Ready Callback

```tsx
import { UbidotsProvider } from '@ubidots/react-html-canvas';

function App() {
  const handleReady = () => {
    console.log('Ubidots system is ready!');
    // Initialize your widget logic
  };

  return (
    <UbidotsProvider onReady={handleReady}>
      <MyWidget />
    </UbidotsProvider>
  );
}
```

### Custom Ready Events

```tsx
import { UbidotsProvider } from '@ubidots/react-html-canvas';

function App() {
  return (
    <UbidotsProvider
      readyEvents={['receivedToken', 'selectedDevice']}
      onReady={() => console.log('Token and device are ready!')}
    >
      <MyWidget />
    </UbidotsProvider>
  );
}
```

### With Origin Validation

```tsx
import { UbidotsProvider } from '@ubidots/react-html-canvas';

function App() {
  const validateOrigin = (origin: string) => {
    const allowedOrigins = [
      'https://app.ubidots.com',
      'https://industrial.ubidots.com',
      'http://localhost:3000', // For development
    ];

    return allowedOrigins.some(allowed => origin.startsWith(allowed));
  };

  return (
    <UbidotsProvider validateOrigin={validateOrigin}>
      <MyWidget />
    </UbidotsProvider>
  );
}
```

### Development/Testing Setup

```tsx
import { UbidotsProvider } from '@ubidots/react-html-canvas';

function App() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <UbidotsProvider
      readyEvents={['receivedToken']}
      initialStateOverride={
        isDevelopment
          ? {
              // Override for testing
              token: 'test-token',
              selectedDevice: { id: 'test-device', name: 'Test Device' },
            }
          : undefined
      }
      validateOrigin={isDevelopment ? undefined : validateProductionOrigin}
    >
      <MyWidget />
    </UbidotsProvider>
  );
}
```

### Multiple Ready Events

```tsx
import { UbidotsProvider } from '@ubidots/react-html-canvas';

function App() {
  return (
    <UbidotsProvider
      readyEvents={[
        'receivedToken',
        'selectedDevice',
        'selectedDashboardDateRange',
        'isRealTimeActive',
      ]}
      onReady={() => {
        console.log('All required data is available!');
      }}
    >
      <ComplexWidget />
    </UbidotsProvider>
  );
}
```

### Error Boundary Integration

```tsx
import { UbidotsProvider } from '@ubidots/react-html-canvas';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role='alert'>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UbidotsProvider
        onReady={() => console.log('System ready')}
        validateOrigin={origin => {
          // Log validation attempts
          console.log('Validating origin:', origin);
          return origin.includes('ubidots.com');
        }}
      >
        <MyWidget />
      </UbidotsProvider>
    </ErrorBoundary>
  );
}
```

### Conditional Provider

```tsx
import { UbidotsProvider } from '@ubidots/react-html-canvas';

function App() {
  const isInUbidotsDashboard = window.parent !== window;

  if (!isInUbidotsDashboard) {
    return (
      <div>
        <h1>Standalone Mode</h1>
        <p>This widget is designed to run inside Ubidots dashboards.</p>
      </div>
    );
  }

  return (
    <UbidotsProvider>
      <MyWidget />
    </UbidotsProvider>
  );
}
```

### Provider with Loading State

```tsx
import { UbidotsProvider, useUbidotsReady } from '@ubidots/react-html-canvas';

function LoadingWrapper({ children }) {
  const ready = useUbidotsReady();

  if (!ready) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <div className='spinner' />
        <p>Connecting to Ubidots...</p>
      </div>
    );
  }

  return children;
}

function App() {
  return (
    <UbidotsProvider readyEvents={['receivedToken', 'selectedDevice']}>
      <LoadingWrapper>
        <MyWidget />
      </LoadingWrapper>
    </UbidotsProvider>
  );
}
```

## Configuration Examples

### Minimal Configuration

```tsx
// Only wait for authentication token
<UbidotsProvider>
  <SimpleWidget />
</UbidotsProvider>
```

### Standard Configuration

```tsx
// Wait for token and device selection
<UbidotsProvider
  readyEvents={['receivedToken', 'selectedDevice']}
  onReady={() => console.log('Ready!')}
>
  <StandardWidget />
</UbidotsProvider>
```

### Comprehensive Configuration

```tsx
// Wait for all common events with security validation
<UbidotsProvider
  readyEvents={[
    'receivedToken',
    'selectedDevice',
    'selectedDashboardDateRange',
    'isRealTimeActive',
  ]}
  onReady={() => {
    console.log('All systems ready');
    analytics.track('widget_ready');
  }}
  validateOrigin={origin => {
    const allowed = [
      'https://app.ubidots.com',
      'https://industrial.ubidots.com',
    ];
    return allowed.includes(origin);
  }}
>
  <AdvancedWidget />
</UbidotsProvider>
```

### Development Configuration

```tsx
// Development setup with mock data
<UbidotsProvider
  readyEvents={['receivedToken']}
  initialStateOverride={{
    token: 'dev-token',
    selectedDevice: { id: 'dev-device', name: 'Development Device' },
    dateRange: {
      startTime: Date.now() - 24 * 60 * 60 * 1000,
      endTime: Date.now(),
    },
    realTime: false,
  }}
  validateOrigin={() => true} // Allow all origins in development
>
  <DevWidget />
</UbidotsProvider>
```

## Best Practices

### 1. Choose Appropriate Ready Events

```tsx
// ✅ Good - Only wait for what you need
<UbidotsProvider readyEvents={["receivedToken"]}>
  <TokenOnlyWidget />
</UbidotsProvider>

// ✅ Good - Wait for device if you need it
<UbidotsProvider readyEvents={["receivedToken", "selectedDevice"]}>
  <DeviceWidget />
</UbidotsProvider>

// ❌ Bad - Waiting for unnecessary events
<UbidotsProvider readyEvents={["receivedToken", "selectedDevice", "isRealTimeActive"]}>
  <SimpleTokenWidget /> {/* Only needs token */}
</UbidotsProvider>
```

### 2. Implement Origin Validation

```tsx
// ✅ Good - Validate origins in production
const validateOrigin = (origin: string) => {
  if (process.env.NODE_ENV === 'development') {
    return true; // Allow all in development
  }

  const allowedOrigins = [
    'https://app.ubidots.com',
    'https://industrial.ubidots.com',
  ];

  return allowedOrigins.some(allowed => origin.startsWith(allowed));
};

<UbidotsProvider validateOrigin={validateOrigin}>
  <SecureWidget />
</UbidotsProvider>;
```

### 3. Handle Ready State Properly

```tsx
// ✅ Good - Use onReady for initialization
<UbidotsProvider
  onReady={() => {
    // Initialize analytics
    // Set up event listeners
    // Load initial data
  }}
>
  <MyWidget />
</UbidotsProvider>
```

### 4. Use Initial State Override for Testing

```tsx
// ✅ Good - Mock data for testing
const mockState = process.env.NODE_ENV === 'test' ? {
  token: 'test-token',
  selectedDevice: { id: 'test-device', name: 'Test Device' },
  ready: true
} : undefined

<UbidotsProvider initialStateOverride={mockState}>
  <TestableWidget />
</UbidotsProvider>
```

## Related Hooks

All hooks require the UbidotsProvider to be present in the component tree:

- [`useUbidotsReady`](./hooks/useUbidotsReady.md) - Check ready state
- [`useUbidotsSelectedDevice`](./hooks/useUbidotsSelectedDevice.md) - Get selected device
- [`useUbidotsActions`](./hooks/useUbidotsActions.md) - Perform dashboard actions
- [`useUbidotsAPI`](./hooks/useUbidotsAPI.md) - Get API client

## Related Types

TypeScript type definitions are available in the library. Detailed type documentation is being prepared.

## Examples

- [Basic Usage Example](../examples/basic-usage/) - Simple provider setup
- [Complete Widget Example](../examples/complete-widget/) - Advanced provider configuration
