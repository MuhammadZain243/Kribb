import { useUserSync } from "@/hooks/useUserSync";
import { Stack } from "expo-router";

// Only reachable while signed in (guarded in the root layout).
export default function AppLayout() {
  // Sync the Clerk user -> Supabase
  useUserSync();

  return <Stack screenOptions={{ headerShown: false }} />;
}
