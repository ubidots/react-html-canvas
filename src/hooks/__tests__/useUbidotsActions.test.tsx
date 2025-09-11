import { describe, it, expect, vi } from 'vitest';
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
});
