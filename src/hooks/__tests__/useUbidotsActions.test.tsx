import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

  describe('getHeaders', () => {
    it('returns JWT headers when JWT token is provided', async () => {
      function HeadersProbe() {
        const actions = useUbidotsActions();
        const [headers, setHeaders] = React.useState<Record<string, string>>(
          {}
        );

        React.useEffect(() => {
          const sendMessage = async () => {
            window.postMessage(
              { event: 'receivedJWTToken', payload: 'jwt-token-123' },
              '*'
            );
            await new Promise(resolve => setTimeout(resolve, 50));
            setHeaders(actions.getHeaders());
          };
          sendMessage();
        }, [actions]);

        return (
          <div data-testid='auth-header'>{headers.Authorization || 'none'}</div>
        );
      }

      render(
        <UbidotsProvider>
          <HeadersProbe />
        </UbidotsProvider>
      );

      await waitFor(() => {
        const authHeader = screen.getByTestId('auth-header');
        expect(authHeader.textContent).toContain('Bearer');
      });
    });

    it('returns X-Auth-Token headers when regular token is provided', async () => {
      function HeadersProbe() {
        const actions = useUbidotsActions();
        const [headers, setHeaders] = React.useState<Record<string, string>>(
          {}
        );

        React.useEffect(() => {
          const sendMessage = async () => {
            window.postMessage(
              { event: 'receivedToken', payload: 'regular-token-456' },
              '*'
            );
            await new Promise(resolve => setTimeout(resolve, 50));
            setHeaders(actions.getHeaders());
          };
          sendMessage();
        }, [actions]);

        return (
          <div data-testid='auth-header'>
            {headers['X-Auth-Token'] || 'none'}
          </div>
        );
      }

      render(
        <UbidotsProvider>
          <HeadersProbe />
        </UbidotsProvider>
      );

      await waitFor(() => {
        const authHeader = screen.getByTestId('auth-header');
        expect(authHeader.textContent).toBe('regular-token-456');
      });
    });
  });

  describe('setDashboardDateRange validation', () => {
    it('allows valid date range with startTime before endTime', () => {
      const postSpy = vi.spyOn(window.parent, 'postMessage');

      function DateRangeTest() {
        const actions = useUbidotsActions();
        React.useEffect(() => {
          actions.setDashboardDateRange({ startTime: 1000, endTime: 2000 });
        }, [actions]);
        return null;
      }

      render(
        <UbidotsProvider>
          <DateRangeTest />
        </UbidotsProvider>
      );

      expect(postSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'setDashboardDateRange',
          payload: { startTime: 1000, endTime: 2000 },
        }),
        '*'
      );

      postSpy.mockRestore();
    });

    it('rejects invalid date range when startTime >= endTime', () => {
      const postSpy = vi.spyOn(window.parent, 'postMessage');
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      function InvalidDateRangeTest() {
        const actions = useUbidotsActions();
        React.useEffect(() => {
          actions.setDashboardDateRange({ startTime: 2000, endTime: 1000 });
        }, [actions]);
        return null;
      }

      render(
        <UbidotsProvider>
          <InvalidDateRangeTest />
        </UbidotsProvider>
      );

      const setDashboardCalls = postSpy.mock.calls.filter(
        call => call[0]?.event === 'setDashboardDateRange'
      );
      expect(setDashboardCalls.length).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('startTime')
      );

      postSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });
});
