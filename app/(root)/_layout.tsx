import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";
import { useUserSync } from "../../hooks/useUserSync";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  //   sync Clerk user -> Supabase (we'll build this later)
  useUserSync();

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return <Slot />;
}
