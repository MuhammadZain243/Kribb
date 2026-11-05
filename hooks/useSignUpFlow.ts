import { useAuth, useSignUp } from "@clerk/expo";
import { useState } from "react";

export type SignUpStep = "form" | "verify_email";
export type SignUpFlow = ReturnType<typeof useSignUpFlow>;

export function useSignUpFlow() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isLoading = fetchStatus === "fetching";
  const isDone = signUp.status === "complete" || !!isSignedIn;

  const needsEmailVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  const step: SignUpStep = needsEmailVerification ? "verify_email" : "form";

  // the address Clerk is verifying, falling back to what the user typed
  const verifyingEmail = signUp.emailAddress ?? email;

  /* ------------------------------ actions ------------------------------ */

  const signUpWithPassword = async () => {
    setFormError(null);

    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const verifyEmailCode = async () => {
    setFormError(null);

    if (code.length !== 6) {
      setFormError("Please enter the complete 6-digit code.");
      return;
    }

    const { error } = await signUp.verifications.verifyEmailCode({ code });

    if (error) {
      setFormError(error.message);
      return;
    }

    if (signUp.status === "complete") {
      // No manual navigation: once the session is active, `isSignedIn` flips
      // and the route guard in app/_layout.tsx moves the user into the app.
      await signUp.finalize({
        navigate: () => {},
      });
    }
  };

  const resendEmailCode = async () => {
    setFormError(null);
    setCode("");
    await signUp.verifications.sendEmailCode();
  };

  return {
    // state
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    formError,
    errors,
    isLoading,
    isDone,
    step,
    verifyingEmail,
    // actions
    signUpWithPassword,
    verifyEmailCode,
    resendEmailCode,
  };
}
