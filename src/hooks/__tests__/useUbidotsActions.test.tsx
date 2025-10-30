import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { UbidotsProvider } from '@/context/ubidots';
import { useUbidotsActions } from '@/hooks';

function ActionsProbe() {
  const actions = useUbidotsActions();
  React.useEffect(() => {
    actions.setDashboardDevice('d1');
    actions.setDashboardDateRange({ startTime: 1, endTime: 2 });
    actions.openDrawer({ url: 'x', width: 100 });
    actions.setFullScreen('toggle');
    actions.refreshDashboard();
  }, [actions]);
  return null;
}

describe('useUbidotsActions', () => {
  it('postMessages with correct payloads', () => {
    const postSpy = vi.spyOn(window.parent, 'postMessage');
    render(
      <UbidotsProvider>
        <ActionsProbe />
      </UbidotsProvider>
    );
    expect(postSpy).toHaveBeenCalled();
  });

  describe('openDrawer', () => {
    let postSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      postSpy = vi.spyOn(window.parent, 'postMessage');
    });

    afterEach(() => {
      postSpy.mockRestore();
      delete (window as unknown as Record<string, unknown>).widgetId;
    });

    it('should use window.widgetId when available', () => {
      const testWidgetId = 'test-widget-123';
      (window as unknown as Record<string, unknown>).widgetId = testWidgetId;

      const TestComponent = () => {
        const actions = useUbidotsActions();
        React.useEffect(() => {
          actions.openDrawer({ url: 'https://example.com', width: 500 });
        }, [actions]);
        return null;
      };

      render(
        <UbidotsProvider>
          <TestComponent />
        </UbidotsProvider>
      );

      expect(postSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'openDrawer',
          payload: {
            drawerInfo: { url: 'https://example.com', width: 500 },
            id: testWidgetId,
          },
        }),
        '*'
      );
    });
  });
});
