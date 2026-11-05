import SetupProgress from "@/components/auth/SetupProgress";
import SignUpFormStep from "@/components/auth/SignUpFormStep";
import SignUpVerifyStep from "@/components/auth/SignUpVerifyStep";
import { useSignUpFlow } from "@/hooks/useSignUpFlow";
import React from "react";

export default function SignUp() {
  const flow = useSignUpFlow();

  // After the code is entered, keep showing progress (step 1) until the route
  // guard moves the user into the app, where step 2 (syncing) continues.
  if (flow.isVerifying || flow.isDone) {
    return <SetupProgress step="verifying" />;
  }

  return flow.step === "verify_email" ? (
    <SignUpVerifyStep flow={flow} />
  ) : (
    <SignUpFormStep flow={flow} />
  );
}
