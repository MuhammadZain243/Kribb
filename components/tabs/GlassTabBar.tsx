import { useUserStore } from "@/store/userStore";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddTabItem from "./AddTabItem";
import TabItem from "./TabItem";
import { ADD_TAB, isTabName, TAB_BAR, TAB_META } from "./tabConfig";

export default function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const isAdmin = useUserStore((s) => s.isAdmin);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const routes = state.routes.filter(
    (route) => isTabName(route.name) && (route.name !== ADD_TAB || isAdmin),
  );

  const focusedKey = state.routes[state.index]?.key;
  const activeIndex = Math.max(
    0,
    routes.findIndex((route) => route.key === focusedKey),
  );
  const activeIsAdd = routes[activeIndex]?.name === ADD_TAB;

  const tabWidth = (width - TAB_BAR.margin * 2) / routes.length;

  // Sliding highlight under the active tab
  const x = useSharedValue(activeIndex * tabWidth);
  const indicatorOpacity = useSharedValue(activeIsAdd ? 0 : 1);

  useEffect(() => {
    x.value = withSpring(activeIndex * tabWidth, {
      damping: 15,
      stiffness: 140,
    });
    indicatorOpacity.value = withTiming(activeIsAdd ? 0 : 1, { duration: 200 });
  }, [activeIndex, tabWidth, activeIsAdd, x, indicatorOpacity]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
    transform: [{ translateX: x.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(16)}
      style={[
        styles.bar,
        {
          left: TAB_BAR.margin,
          right: TAB_BAR.margin,
          bottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      {/* Frosted-glass look (separate layer so the Add button can overflow).
          No real blur: Android's blur crashes when hardware-bitmap images
          (avatars, property photos) are behind it. */}
      <View style={styles.glassClip} />

      {/* Sliding pill */}
      <Animated.View
        pointerEvents="none"
        style={[styles.indicatorSlot, { width: tabWidth }, indicatorStyle]}
      >
        <View style={styles.indicator} />
      </Animated.View>

      {/* Tabs */}
      <View style={styles.row}>
        {routes.map((route) => {
          const focused = route.key === focusedKey;
          const meta = TAB_META[route.name as keyof typeof TAB_META];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () =>
            navigation.emit({ type: "tabLongPress", target: route.key });

          if (route.name === ADD_TAB) {
            return (
              <AddTabItem
                key={route.key}
                focused={focused}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          }

          return (
            <TabItem
              key={route.key}
              focused={focused}
              icon={meta.icon}
              label={meta.label}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    height: TAB_BAR.height,
  },
  glassClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: TAB_BAR.radius,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    elevation: 8,
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  indicatorSlot: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    width: "78%",
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(37,99,235,0.14)",
  },
});
