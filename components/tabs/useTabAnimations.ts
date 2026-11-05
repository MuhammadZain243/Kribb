import { useEffect } from "react";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { SPRING_CONFIG } from "./tabConfig";

/** 0 -> 1 spring value that follows an `active` flag. */
export function useSpringProgress(active: boolean) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(active ? 1 : 0, SPRING_CONFIG);
  }, [active, progress]);

  return progress;
}

/** Spring "squish" scale for press feedback. */
export function usePressScale(pressedScale = 0.85) {
  const scale = useSharedValue(1);

  return {
    scale,
    onPressIn: () => {
      scale.value = withSpring(pressedScale, SPRING_CONFIG);
    },
    onPressOut: () => {
      scale.value = withSpring(1, SPRING_CONFIG);
    },
  };
}
