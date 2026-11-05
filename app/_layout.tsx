import AnimatedSplash from "@/components/AnimatedSplash";
import { env } from "@/lib/env";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { SplashScreen, Stack } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import "../global.css";

// Keep the native splash up until <AnimatedSplash /> has drawn its first frame.
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isSignedIn, isLoaded } = useAuth();
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  return (
    <View style={{ flex: 1 }}>
      {/* Route guards: signed-in users can only reach (root), signed-out users
          can only reach (auth). Mounted once Clerk has loaded, and revealed
          when the splash fades out. */}
      {isLoaded && (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!!isSignedIn}>
            <Stack.Screen name="(root)" />
          </Stack.Protected>

          <Stack.Protected guard={!isSignedIn}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
      )}

      {!splashDone && (
        <AnimatedSplash ready={isLoaded} onFinish={handleSplashFinish} />
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={env.clerkPublishableKey}
      tokenCache={tokenCache}
    >
      <RootNavigator />
    </ClerkProvider>
  );
}
