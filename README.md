# @ubidots/react-html-canvas

React library to interact with Ubidots dashboards from HTML Canvas widgets.

## Instalación

```bash
pnpm add @ubidots/react-html-canvas
```

### Peer Dependencies

- react >= 16.8
- react-dom >= 16.8

## Basic Usage

Wrap your app with the Provider and use hooks to access dashboard data/events:

```tsx
import {
  UbidotsProvider,
  useUbidotsReady,
  useUbidotsSelectedDevice,
  useUbidotsActions,
} from '@ubidots/react-html-canvas';

function DeviceInfo() {
  const ready = useUbidotsReady();
  const device = useUbidotsSelectedDevice();
  const { setDashboardDevice } = useUbidotsActions();

  if (!ready) return <span>Loading...</span>;
  return (
    <div>
      <pre>{JSON.stringify(device, null, 2)}</pre>
      <button onClick={() => setDashboardDevice('device-id')}>
        Select Device
      </button>
    </div>
  );
}

export default function App() {
  return (
    <UbidotsProvider readyEvents={['receivedToken']}>
      <DeviceInfo />
    </UbidotsProvider>
  );
}
```

## API

- Provider
  - UbidotsProvider(props)
    - props:
      - onReady?: () => void
      - readyEvents?: ("receivedToken" | "receivedJWTToken" | "selectedDevice" | ...)[]
      - validateOrigin?: (origin: string) => boolean
      - initialStateOverride?: Partial<State>

- Hooks
  - useUbidotsReady(): boolean
  - useUbidotsToken(): string | null
  - useUbidotsSelectedDevice(): Device | null
  - useUbidotsSelectedDevices(): Device[] | null
  - useUbidotsDashboardDateRange(): DateRange | null
  - useUbidotsRealTimeStatus(): boolean | null
  - useUbidotsDeviceObject(): DeviceObject | null
  - useUbidotsDashboardObject(): DashboardObject | null
  - useUbidotsSelectedFilters(): Filter[] | null
  - useUbidotsWidget(): { settings: object; id: string } | null
  - useUbidotsActions(): Actions
  - useUbidotsAPI(): Ubidots API client (autenticado con token)

- Acciones (useUbidotsActions)
  - setDashboardDevice(deviceId: string)
  - setDashboardMultipleDevices(deviceIds: string[])
  - setDashboardDateRange(range: { startTime: number; endTime: number })
  - setDashboardLayer(layerId: string)
  - setRealTime(rt: boolean)
  - refreshDashboard()
  - openDrawer({ url: string; width: number })
  - setFullScreen('toggle' | 'enable' | 'disable')
  - getHeaders(): { Authorization | X-Auth-Token, Content-type }

## Examples & Documentation

### 📚 Complete Documentation

See the [docs/](./docs/) folder for comprehensive API documentation:

- **Provider**: [UbidotsProvider](./docs/UbidotsProvider.md)
- **Hooks**: Individual documentation for each hook
- **Types**: TypeScript interfaces and types
- **Guides**: Setup, patterns, and best practices

### 🎯 Working Examples

See the [examples/](./examples/) folder for complete working examples:

- **[Basic Usage](./examples/basic-usage/)** - Simple setup and device display
- **[Device Selector](./examples/device-selector/)** - Interactive device selection with single/multi-select
- **[Real-time Dashboard](./examples/real-time-dashboard/)** - Live data streaming and controls
- **[Complete Widget](./examples/complete-widget/)** - Comprehensive example testing all features
- **[With HOCs](./examples/with-hocs/)** - Higher-Order Components usage

## Configurable Ready State

You can control which events must occur before considering the system "ready":

```tsx
<UbidotsProvider readyEvents={['receivedToken', 'selectedDevice']} />
```

## Notes

- The vanilla library (ubidots-html-canvas) was used as reference for events/methods. It's not a runtime dependency.
- The useUbidotsAPI hook exposes an SDK client and authenticates it when the token arrives.

## Development

### Code Quality

This project uses ESLint for linting and Prettier for code formatting to ensure consistent code style.

#### Available Scripts

```bash

# Install dependencies
pnpm install

# Run linter
pnpm run lint

# Run linter with automatic fixes
pnpm run lint:fix

# Format code with Prettier
pnpm run format

# Check if code is properly formatted
pnpm run format:check
```

#### VS Code Integration

If you're using VS Code, the project includes settings that will:

- Format code automatically on save
- Run ESLint fixes on save
- Show linting errors and warnings inline

Make sure you have the following VS Code extensions installed:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

#### Configuration Files

- `eslint.config.js` - ESLint configuration with React, TypeScript, and accessibility rules
- `.prettierrc` - Prettier formatting configuration
- `.editorconfig` - Editor configuration for consistent coding styles
- `.vscode/settings.json` - VS Code specific settings

### CI/CD Pipelines

This project uses GitHub Actions for continuous integration and deployment:

#### Pull Request Checks (`.github/workflows/pr-checks.yml`)

Runs on every PR and push to main/develop branches:

- **Code Quality & Tests**: Runs on Node.js 18 and 20
  - TypeScript compilation check
  - ESLint code quality check
  - Prettier formatting verification
  - Unit tests execution
  - Build verification
- **Security Audit**: Checks for vulnerabilities in dependencies
- **PR Summary**: Posts automated summary comment on PRs

#### Deployment Pipeline (`.github/workflows/deploy.yml`)

Automated deployment workflow triggered when version changes are merged to main:

- **Automatic Trigger**: Runs when package.json changes are pushed to main
- **Version Validation**: Docker-based validation ensures semantic version increments
- **Pre-release Detection**: Auto-detects pre-release tags from version format
- **Quality Checks**: Full linting, testing, and build verification before publish
- **NPM Publishing**: Uses OIDC trusted publishing with provenance attestation
- **GitHub Release**: Creates release with installation instructions

### How to Deploy

To deploy a new version:

1. **Update version in your PR**:
   ```bash
   # For stable releases
   npm version patch  # or minor, major

   # For pre-releases
   npm version prerelease --preid=beta
   ```

2. **Commit and create PR**:
   ```bash
   git add package.json
   git commit -m "chore: bump version to vX.Y.Z"
   git push
   ```

3. **Merge to main**:
   - Ensure all PR checks pass
   - Merge the PR

4. **Automatic deployment**:
   - Workflow automatically publishes to npm
   - GitHub release created automatically

#### Version Formats

- `1.0.0` → npm tag: `latest`
- `1.0.0-beta.1` → npm tag: `beta`
- `1.0.0-alpha.1` → npm tag: `alpha`

## License

MIT
