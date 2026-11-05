import { Stack } from "expo-router";

// Only reachable while signed out (guarded in the root layout).
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: "fade" }} />;
}
