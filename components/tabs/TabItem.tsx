import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { IconName, TAB_COLORS, tabItemStyle } from "./tabConfig";
import { usePressScale, useSpringProgress } from "./useTabAnimations";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

type Props = {
  focused: boolean;
  icon: IconName;
  label: string;
  onPress: () => void;
  onLongPress: () => void;
};

export default function TabItem({
  focused,
  icon,
  label,
  onPress,
  onLongPress,
}: Props) {
  const progress = useSpringProgress(focused);
  const press = usePressScale(0.85);

  const iconWrapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -3]) },
      {
        scale:
          interpolate(progress.value, [0, 1], [1, 1.18]) * press.scale.value,
      },
    ],
  }));

  const iconProps = useAnimatedProps(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [TAB_COLORS.inactive, TAB_COLORS.active],
    ),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.75, 1]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -2]) }],
    color: interpolateColor(
      progress.value,
      [0, 1],
      [TAB_COLORS.inactive, TAB_COLORS.active],
    ),
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
      accessibilityLabel={label}
    >
      <Animated.View style={iconWrapStyle}>
        <AnimatedIcon name={icon} size={26} animatedProps={iconProps} />
      </Animated.View>
      <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
});
