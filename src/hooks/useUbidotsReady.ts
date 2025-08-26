import { useUbidots } from './useUbidots';

export function useUbidotsReady() {
  const { state } = useUbidots();
  return state.ready;
}
