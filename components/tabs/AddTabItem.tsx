import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { TAB_COLORS, tabItemStyle } from "./tabConfig";
import { usePressScale, useSpringProgress } from "./useTabAnimations";

type Props = {
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

export default function AddTabItem({ focused, onPress, onLongPress }: Props) {
  const progress = useSpringProgress(focused);
  const press = usePressScale(0.88);
  const pulse = useSharedValue(0);

  // Idle pulsing ring. Stopped while focused so it doesn't animate invisibly.
  useEffect(() => {
    cancelAnimation(pulse);
    pulse.value = 0;

    if (!focused) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      );
    }

    return () => cancelAnimation(pulse);
  }, [focused, pulse]);

  const buttonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [TAB_COLORS.active, TAB_COLORS.activeDark],
    ),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -4]) },
      {
        scale:
          interpolate(progress.value, [0, 1], [1, 1.08]) * press.scale.value,
      },
    ],
  }));

  const plusStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 135])}deg` },
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.35, 0]) * (1 - progress.value),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.6]) }],
  }));

  return (
    <Pressable
      style={tabItemStyle}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel="Add Property"
    >
      <View style={styles.wrap} pointerEvents="none">
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={[styles.button, buttonStyle]}>
          <Animated.View style={plusStyle}>
            <MaterialIcons name="add" size={36} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: -38,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: TAB_COLORS.active,
  },
  button: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.95)",
    elevation: 10,
    shadowColor: TAB_COLORS.active,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
});
