import { useUbidots } from '../context/ubidots';

export function useUbidotsReady() {
  const { state } = useUbidots();
  return state.ready;
}
