import SignUpFormStep from "@/components/auth/SignUpFormStep";
import SignUpVerifyStep from "@/components/auth/SignUpVerifyStep";
import { useSignUpFlow } from "@/hooks/useSignUpFlow";
import React from "react";

export default function SignUp() {
  const flow = useSignUpFlow();

  if (flow.isDone) return null;

  return flow.step === "verify_email" ? (
    <SignUpVerifyStep flow={flow} />
  ) : (
    <SignUpFormStep flow={flow} />
  );
}
