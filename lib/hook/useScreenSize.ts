import { useSyncExternalStore } from "react";

function onWindowSizeChange(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function getWindowWidthSnapshot() {
  return window.innerWidth;
}

function getWindowHeightSnapshot() {
  return window.innerHeight;
}

export function useWindowSize() {
  const windowWidth = useSyncExternalStore(
    onWindowSizeChange,
    getWindowWidthSnapshot,
    () => 0
  );

  const windowHeight = useSyncExternalStore(
    onWindowSizeChange,
    getWindowHeightSnapshot,
    () => 0
  );

  return { width: windowWidth, height: windowHeight };
}

export function useMobileScreen() {
  const { width } = useWindowSize();
  return width < 768;
}
export function useTabScreen() {
  const { width } = useWindowSize();
  return width < 1024;
}
