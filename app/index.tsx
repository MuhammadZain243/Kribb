import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  // If use is logged-in then redirect to the home page, otherwise redirect to the sign-in page
  if (isSignedIn) return <Redirect href={"/(root)/(tabs)"} />;

  return <Redirect href={"/sign-up"} />;
}
