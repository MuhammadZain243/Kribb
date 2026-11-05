import CredentialsStep from "@/components/auth/CredentialsStep";
import EmailVerificationStep from "@/components/auth/EmailVerificationStep";
import SecondFactorStep from "@/components/auth/SecondFactorStep";
import SetupProgress from "@/components/auth/SetupProgress";
import { useSignInFlow } from "@/hooks/useSignInFlow";
import React from "react";

export default function SignIn() {
  const flow = useSignInFlow();

  // Signed in: show progress until the route guard moves the user into the app
  if (flow.isDone) return <SetupProgress step="verifying" />;

  switch (flow.step) {
    case "second_factor":
      return <SecondFactorStep flow={flow} />;
    case "client_trust":
      return <EmailVerificationStep flow={flow} />;
    default:
      return <CredentialsStep flow={flow} />;
  }
}
