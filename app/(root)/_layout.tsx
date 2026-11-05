import SetupProgress from "@/components/auth/SetupProgress";
import { useUserSync } from "@/hooks/useUserSync";
import { useAuth } from "@clerk/expo";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

/** Keeps the progress screen up long enough to read, even on fast networks. */
const MIN_SETUP_MS = 900;

// Only reachable while signed in (guarded in the root layout).
export default function AppLayout() {
  const { status, error, retry } = useUserSync();
  const { signOut } = useAuth();
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), MIN_SETUP_MS);
    return () => clearTimeout(timer);
  }, []);

  // Don't show the app until the user exists in Supabase (and isAdmin is known)
  if (status !== "synced" || !minElapsed) {
    return (
      <SetupProgress
        step="syncing"
        error={status === "error" ? error : null}
        onRetry={retry}
        onSignOut={() => signOut()}
      />
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
