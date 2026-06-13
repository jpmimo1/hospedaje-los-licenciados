import { useSyncExternalStore } from "react";

// Empty subscription since there is no actual external store to listen to
const emptySubscribe = () => () => {};

export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
