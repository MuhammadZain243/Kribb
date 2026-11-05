import { SplashScreen } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/** Keep these in sync with the expo-splash-screen plugin in app.json. */
const LOGO = require("@/assets/images/kribb.png");
const LOGO_SIZE = 200;
const BACKGROUND = "#FFFFFF";
const BRAND = "#2563EB";

/** Shortest time the splash stays up, so it never just flashes. */
const MIN_VISIBLE_MS = 1400;
const EXIT_MS = 550;

type Props = {
  /** Flip to true once the app can be shown (e.g. Clerk has loaded). */
  ready: boolean;
  onFinish: () => void;
};

function Dot({ index }: { index: number }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      index * 160,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 350, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(t);
  }, [index, t]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.3 + 0.7 * t.value,
    transform: [{ translateY: -6 * t.value }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

export default function AnimatedSplash({ ready, onFinish }: Props) {
  const [minElapsed, setMinElapsed] = useState(false);
  const pulse = useSharedValue(1);
  const exit = useSharedValue(0);

  // Hide the native splash as soon as our logo is drawn. Both show the same
  // logo in the same place, so the hand-off is invisible.
  const hideNativeSplash = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  // Gentle "breathing" while we wait
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(pulse);
  }, [pulse]);

  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  // Exit: logo grows, everything fades out to reveal the app underneath
  useEffect(() => {
    if (!ready || !minElapsed) return;

    exit.value = withTiming(1, {
      duration: EXIT_MS,
      easing: Easing.out(Easing.cubic),
    });

    const timer = setTimeout(onFinish, EXIT_MS);
    return () => clearTimeout(timer);
  }, [ready, minElapsed, exit, onFinish]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(exit.value, [0, 1], [1, 0]),
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pulse.value * interpolate(exit.value, [0, 1], [1, 1.25]) },
    ],
  }));

  const dotsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(exit.value, [0, 0.4], [1, 0], "clamp"),
  }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Animated.View style={logoStyle}>
        <Image
          source={LOGO}
          style={styles.logo}
          resizeMode="contain"
          onLoadEnd={hideNativeSplash}
        />
      </Animated.View>

      {/* absolutely positioned so the logo stays exactly centred */}
      <Animated.View style={[styles.dots, dotsStyle]}>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <Dot key={i} index={i} />
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  dots: {
    position: "absolute",
    bottom: 96,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND,
  },
});
