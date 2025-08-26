import React from 'react';
import { useUbidotsSelectedDevice } from '@/hooks/useUbidotsSelections';
import type { Device } from '@/types';

export function withSelectedDevice<
  P extends { selectedDevice?: Device | null },
>(Component: React.ComponentType<P>) {
  return function Wrapped(props: Omit<P, 'selectedDevice'>) {
    const selectedDevice = useUbidotsSelectedDevice();
    return <Component {...(props as P)} selectedDevice={selectedDevice} />;
  };
}
