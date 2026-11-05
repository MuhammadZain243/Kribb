import { useUserStore } from "@/store/userStore";
import { MaterialIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { useEffect } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const ACTIVE = "#2563EB";
const INACTIVE = "#64748B";
const BAR_HEIGHT = 68;
const BAR_MARGIN = 16;
const SPRING = { damping: 14, stiffness: 160, mass: 0.7 };

const TAB_META: Record<
  string,
  { icon: keyof typeof MaterialIcons.glyphMap; label: string }
> = {
  index: { icon: "home", label: "Home" },
  search: { icon: "search", label: "Search" },
  create: { icon: "add", label: "Add Property" },
  saved: { icon: "favorite", label: "Saved" },
  profile: { icon: "person", label: "Profile" },
};

const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

/* -------------------------------------------------------------------------- */
/*                              Regular tab item                              */
/* -------------------------------------------------------------------------- */

type ItemProps = {
  focused: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({ focused, icon, label, onPress, onLongPress }: ItemProps) {
  const progress = useSharedValue(focused ? 1 : 0);
  const press = useSharedValue(1);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, SPRING);
  }, [focused, progress]);

  const iconWrapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -3]) },
      { scale: interpolate(progress.value, [0, 1], [1, 1.18]) * press.value },
    ],
  }));

  const iconProps = useAnimatedProps(() => ({
    color: interpolateColor(progress.value, [0, 1], [INACTIVE, ACTIVE]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.75, 1]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -2]) }],
    color: interpolateColor(progress.value, [0, 1], [INACTIVE, ACTIVE]),
  }));

  return (
    <Pressable
      style={styles.item}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => (press.value = withSpring(0.85, SPRING))}
      onPressOut={() => (press.value = withSpring(1, SPRING))}
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

/* -------------------------------------------------------------------------- */
/*                         Big raised "Add Property" item                      */
/* -------------------------------------------------------------------------- */

type AddProps = {
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function AddItem({ focused, onPress, onLongPress }: AddProps) {
  const progress = useSharedValue(focused ? 1 : 0);
  const press = useSharedValue(1);
  const pulse = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, SPRING);
  }, [focused, progress]);

  // idle pulsing ring
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
  }, [pulse]);

  const buttonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#2563EB", "#1D4ED8"],
    ),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -4]) },
      { scale: interpolate(progress.value, [0, 1], [1, 1.08]) * press.value },
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
      style={styles.item}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => (press.value = withSpring(0.88, SPRING))}
      onPressOut={() => (press.value = withSpring(1, SPRING))}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel="Add Property"
    >
      <View style={styles.addWrap} pointerEvents="none">
        <Animated.View style={[styles.addRing, ringStyle]} />
        <Animated.View style={[styles.addButton, buttonStyle]}>
          <Animated.View style={plusStyle}>
            <MaterialIcons name="add" size={36} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Custom tab bar                               */
/* -------------------------------------------------------------------------- */

function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const isAdmin = useUserStore((s) => s.isAdmin);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const routes = state.routes.filter(
    (r) => TAB_META[r.name] && (r.name !== "create" || isAdmin),
  );

  const focusedKey = state.routes[state.index]?.key;
  const activeIndex = Math.max(
    0,
    routes.findIndex((r) => r.key === focusedKey),
  );
  const activeIsAdd = routes[activeIndex]?.name === "create";

  const barWidth = width - BAR_MARGIN * 2;
  const tabWidth = barWidth / routes.length;

  // sliding highlight under the active tab
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
          left: BAR_MARGIN,
          right: BAR_MARGIN,
          bottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      {/* glass background (clipped separately so the Add button can overflow) */}
      <View style={styles.glassClip}>
        <BlurView
          intensity={60}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.glassTint} />
      </View>

      {/* sliding pill */}
      <Animated.View
        pointerEvents="none"
        style={[styles.indicatorSlot, { width: tabWidth }, indicatorStyle]}
      >
        <View style={styles.indicator} />
      </Animated.View>

      {/* tabs */}
      <View style={styles.row}>
        {routes.map((route) => {
          const focused = route.key === focusedKey;
          const meta = TAB_META[route.name];

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

          if (route.name === "create") {
            return (
              <AddItem
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

/* -------------------------------------------------------------------------- */
/*                                   Layouts                                  */
/* -------------------------------------------------------------------------- */

function AndroidTabs() {
  const isAdmin = useUserStore((state) => state.isAdmin);

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen
        name="create"
        options={{
          title: "Add Property",
          href: isAdmin ? undefined : null,
        }}
      />
      <Tabs.Screen name="saved" options={{ title: "Saved" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

function IOSTabs() {
  const isAdmin = useUserStore((state) => state.isAdmin);

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Icon sf="magnifyingglass" />
        <Label>Search</Label>
      </NativeTabs.Trigger>

      {isAdmin && (
        <NativeTabs.Trigger name="create">
          <Icon sf="plus.circle.fill" />
          <Label>Add Property</Label>
        </NativeTabs.Trigger>
      )}

      <NativeTabs.Trigger name="saved">
        <Icon sf="heart.fill" />
        <Label>Saved</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

export default function TabLayout() {
  return Platform.OS === "ios" ? <IOSTabs /> : <AndroidTabs />;
}

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    height: BAR_HEIGHT,
  },
  glassClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
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
  addWrap: {
    marginTop: -38,
    alignItems: "center",
    justifyContent: "center",
  },
  addRing: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2563EB",
  },
  addButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.95)",
    elevation: 10,
    shadowColor: "#2563EB",
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
});
