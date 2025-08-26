import { createContext } from 'react';
import type { UbidotsState, UbidotsActions } from '@/types';

export interface UbidotsContextValue {
  state: UbidotsState;
  actions: UbidotsActions;
}

export const UbidotsContext = createContext<UbidotsContextValue | undefined>(
  undefined
);
