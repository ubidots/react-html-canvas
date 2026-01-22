# Examples

This folder contains practical examples of how to use `@ubidots/react-html-canvas` in different scenarios.

## Available Examples

### 1. **basic-usage** - Basic Usage

Simple example showing how to set up the provider and use basic hooks.

### 2. **device-selector** - Device Selector

Component that allows selecting devices and displays detailed information.

### 3. **real-time-dashboard** - Real-time Dashboard

Shows how to work with real-time data.

### 4. **complete-widget** - Complete Widget

Complete example demonstrating all available functionalities.

### 5. **with-hocs** - Using HOCs

Examples using Higher-Order Components to inject props.

### 6. **event-versioning** - Event Versioning

Demonstrates V1 and V2 event compatibility and automatic event emission.

### 7. **widget-events-basic** - Widget Events (Basic)

Shows how to use widget-specific events with the `v2:widget:<event>:<widgetId>` pattern. Demonstrates event emission, monitoring, and lifecycle events.

### 8. **widget-events-multi** - Widget Events (Multi-Widget)

Advanced example showing multiple widgets on the same page with isolated event namespaces and inter-widget communication.

## How to Use Examples

Each example is an independent React component that you can copy and adapt to your project.

```bash
# Install dependencies
npm install @ubidots/react-html-canvas

# Copy the example you need
cp examples/basic-usage/BasicUsage.tsx src/components/
```

## Structure of Each Example

```
example-name/
├── README.md          # Example-specific documentation
├── ExampleName.tsx    # Main component
├── types.ts          # Specific types (if applicable)
└── utils.ts          # Utilities (if applicable)
```
