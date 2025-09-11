import React from 'react';
import { useUbidotsActions } from '@/hooks/useUbidotsActions';
import type { UbidotsActions } from '@/types';

export function withUbidotsActions<
  P extends { ubidotsActions?: UbidotsActions },
>(Component: React.ComponentType<P>) {
  return function Wrapped(props: Omit<P, 'ubidotsActions'>) {
    const ubidotsActions = useUbidotsActions();
    return <Component {...(props as P)} ubidotsActions={ubidotsActions} />;
  };
}
