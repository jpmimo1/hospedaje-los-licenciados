import { useSyncExternalStore } from "react";

// Una función vacía porque no necesitamos suscribirnos a nada
const emptySubscribe = () => () => {};

export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // getSnapshot: En el cliente siempre es true
    () => false, // getServerSnapshot: En el servidor siempre es false
  );
}
