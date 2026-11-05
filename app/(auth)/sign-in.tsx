import CredentialsStep from "@/components/auth/CredentialsStep";
import EmailVerificationStep from "@/components/auth/EmailVerificationStep";
import SecondFactorStep from "@/components/auth/SecondFactorStep";
import { useSignInFlow } from "@/hooks/useSignInFlow";
import React from "react";

export default function SignIn() {
  const flow = useSignInFlow();

  if (flow.isDone) return null;

  switch (flow.step) {
    case "second_factor":
      return <SecondFactorStep flow={flow} />;
    case "client_trust":
      return <EmailVerificationStep flow={flow} />;
    default:
      return <CredentialsStep flow={flow} />;
  }
}
