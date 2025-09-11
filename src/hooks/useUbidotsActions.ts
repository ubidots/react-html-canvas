import { useUbidots } from '../context/ubidots';

export function useUbidotsActions() {
  return useUbidots().actions;
}
