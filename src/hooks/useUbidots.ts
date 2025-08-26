import { useContext } from 'react';
import { UbidotsContext } from '@/context/UbidotsContext';

export function useUbidots() {
  const ctx = useContext(UbidotsContext);
  if (!ctx) throw new Error('useUbidots must be used within UbidotsProvider');
  return ctx;
}
