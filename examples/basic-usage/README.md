# Basic Usage Example

This example demonstrates the fundamental setup and usage of `@ubidots/react-html-canvas`.

## What it shows

- How to wrap your app with `UbidotsProvider`
- Using `useUbidotsReady` to check if the system is ready
- Using `useUbidotsSelectedDevice` to get the current device
- Using `useUbidotsActions` to interact with the dashboard

## Key concepts

- **Provider setup**: The `UbidotsProvider` must wrap your component tree
- **Ready state**: Always check if the system is ready before using data
- **Device selection**: Access the currently selected device from the dashboard
- **Actions**: Send commands back to the dashboard

## Usage

```tsx
import { BasicUsage } from './BasicUsage';

function App() {
  return <BasicUsage />;
}
```

## Features demonstrated

- ✅ Provider configuration
- ✅ Ready state checking
- ✅ Device information display
- ✅ Basic dashboard actions
