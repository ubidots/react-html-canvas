import React from 'react';
import ReactDOM from 'react-dom/client';

// Import examples
import BasicUsage from '../basic-usage/BasicUsage.jsx';
import DeviceSelector from '../device-selector/DeviceSelector.jsx';
import RealTimeDashboard from '../real-time-dashboard/RealTimeDashboard.jsx';
import CompleteWidget from '../complete-widget/CompleteWidget.jsx';
import EventVersioningExample from '../event-versioning/EventVersioningExample.jsx';
import WidgetEventsBasic from '../widget-events-basic/WidgetEventsBasic.jsx';
import WidgetEventsMulti from '../widget-events-multi/WidgetEventsMulti.jsx';
import WithHocsExample from '../with-hocs/WithHocsExample.jsx';

// Get example from URL query parameter
// eslint-disable-next-line no-undef
const urlParams = new URLSearchParams(window.location.search);
const exampleName = urlParams.get('example');

// Map example names to components
const examples = {
  'basic-usage': BasicUsage,
  'device-selector': DeviceSelector,
  'real-time-dashboard': RealTimeDashboard,
  'complete-widget': CompleteWidget,
  'event-versioning': EventVersioningExample,
  'widget-events-basic': WidgetEventsBasic,
  'widget-events-multi': WidgetEventsMulti,
  'with-hocs': WithHocsExample,
};

// Get the component to render
const ExampleComponent = examples[exampleName];

// Gallery component
function ExamplesGallery() {
  return (
    <div className='gallery-wrapper'>
      <div className='container'>
        <header>
          <h1>🚀 Ubidots React HTML Canvas</h1>
          <p>Interactive Examples & Demos</p>
        </header>

        <div className='examples-grid'>
          <a href='?example=basic-usage' className='example-card'>
            <h3>📱 Basic Usage</h3>
            <p>
              Simple setup showing core functionality with device display and
              basic actions.
            </p>
            <div className='tags'>
              <span className='tag'>Beginner</span>
              <span className='tag'>Provider</span>
              <span className='tag'>Hooks</span>
            </div>
          </a>

          <a href='?example=device-selector' className='example-card'>
            <h3>🎯 Device Selector</h3>
            <p>
              Interactive device selection with single and multi-select
              capabilities.
            </p>
            <div className='tags'>
              <span className='tag'>Intermediate</span>
              <span className='tag'>Devices</span>
            </div>
          </a>

          <a href='?example=real-time-dashboard' className='example-card'>
            <h3>⚡ Real-time Dashboard</h3>
            <p>Live data streaming and real-time controls demonstration.</p>
            <div className='tags'>
              <span className='tag'>Advanced</span>
              <span className='tag'>Real-time</span>
            </div>
          </a>

          <a href='?example=complete-widget' className='example-card'>
            <h3>🎨 Complete Widget</h3>
            <p>
              Comprehensive example testing all available features and
              capabilities.
            </p>
            <div className='tags'>
              <span className='tag'>Advanced</span>
              <span className='tag'>Complete</span>
            </div>
          </a>

          <a href='?example=event-versioning' className='example-card'>
            <h3>🔄 Event Versioning</h3>
            <p>V1 and V2 event compatibility with automatic event emission.</p>
            <div className='tags'>
              <span className='tag'>Intermediate</span>
              <span className='tag'>Events</span>
            </div>
          </a>

          <a href='?example=widget-events-basic' className='example-card'>
            <h3>🎯 Widget Events (Basic)</h3>
            <p>
              Widget-specific events with
              v2:widget:&lt;event&gt;:&lt;widgetId&gt; pattern.
            </p>
            <div className='tags'>
              <span className='tag new'>NEW</span>
              <span className='tag'>Widget Events</span>
              <span className='tag'>V2</span>
            </div>
          </a>

          <a href='?example=widget-events-multi' className='example-card'>
            <h3>🎭 Widget Events (Multi)</h3>
            <p>
              Multiple widgets with isolated namespaces and inter-widget
              communication.
            </p>
            <div className='tags'>
              <span className='tag new'>NEW</span>
              <span className='tag'>Advanced</span>
              <span className='tag'>Multi-Widget</span>
            </div>
          </a>

          <a href='?example=with-hocs' className='example-card'>
            <h3>🔧 With HOCs</h3>
            <p>Higher-Order Components usage for prop injection.</p>
            <div className='tags'>
              <span className='tag'>Advanced</span>
              <span className='tag'>HOCs</span>
            </div>
          </a>
        </div>

        <footer>
          <p>
            📚{' '}
            <a
              href='https://github.com/ubidots/react-html-canvas'
              target='_blank'
              rel='noreferrer'
            >
              Documentation
            </a>{' '}
            | 🐛{' '}
            <a
              href='https://github.com/ubidots/react-html-canvas/issues'
              target='_blank'
              rel='noreferrer'
            >
              Report Issues
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

// Render the example or show error
// eslint-disable-next-line no-undef
const root = ReactDOM.createRoot(document.getElementById('root'));

if (ExampleComponent) {
  root.render(
    <React.StrictMode>
      <ExampleComponent />
    </React.StrictMode>
  );
} else if (!exampleName) {
  // Show the gallery
  root.render(
    <React.StrictMode>
      <ExamplesGallery />
    </React.StrictMode>
  );
} else {
  root.render(
    <div
      style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>❌ Example not found</h1>
      <p>The example does not exist.</p>
      <a href='/' style={{ color: '#667eea', textDecoration: 'underline' }}>
        ← Back to examples
      </a>
    </div>
  );
}
