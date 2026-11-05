import { useAuth, useSignIn } from "@clerk/expo";
import { useState } from "react";

export type SecondFactorStrategy = "phone_code" | "totp" | "backup_code";
export type SignInStep = "credentials" | "second_factor" | "client_trust";
export type SignInFlow = ReturnType<typeof useSignInFlow>;

export function useSignInFlow() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [secondFactorStrategy, setSecondFactorStrategy] =
    useState<SecondFactorStrategy | null>(null);

  const isLoading = fetchStatus === "fetching";
  const isDone = signIn.status === "complete" || !!isSignedIn;

  const step: SignInStep =
    signIn.status === "needs_second_factor"
      ? "second_factor"
      : signIn.status === "needs_client_trust"
        ? "client_trust"
        : "credentials";

  const supportedSecondFactors: SecondFactorStrategy[] =
    step === "second_factor"
      ? signIn.supportedSecondFactors
          .map((factor) => factor.strategy)
          .filter(
            (strategy): strategy is SecondFactorStrategy =>
              strategy === "phone_code" ||
              strategy === "totp" ||
              strategy === "backup_code",
          )
      : [];

  const selectedStrategy: SecondFactorStrategy | null =
    secondFactorStrategy ?? supportedSecondFactors[0] ?? null;

  /* ------------------------------ helpers ------------------------------ */

  const finalizeSignIn = async () => {
    if (signIn.status !== "complete") return;

    // No manual navigation: once the session is active, `isSignedIn` flips
    // and the route guard in app/_layout.tsx moves the user into the app.
    await signIn.finalize({
      navigate: ({ session }) => {
        if (session?.currentTask) {
          console.log(session.currentTask);
        }
      },
    });
  };

  const selectSecondFactor = async (strategy: SecondFactorStrategy) => {
    setSecondFactorStrategy(strategy);
    setCode("");
    setFormError(null);

    if (strategy === "phone_code") {
      await signIn.mfa.sendPhoneCode();
    }
  };

  /* ------------------------------ actions ------------------------------ */

  const signInWithPassword = async () => {
    setFormError(null);

    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
    } else if (signIn.status === "needs_second_factor") {
      const secondFactor = signIn.supportedSecondFactors.find(
        (factor) =>
          factor.strategy === "phone_code" ||
          factor.strategy === "totp" ||
          factor.strategy === "backup_code",
      );

      if (!secondFactor) {
        setFormError("No supported second-factor method is available.");
        return;
      }

      await selectSecondFactor(secondFactor.strategy as SecondFactorStrategy);
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.log("Sign-in attempt not complete:", signIn);
    }
  };

  const verifyEmailCode = async () => {
    setFormError(null);
    await signIn.mfa.verifyEmailCode({ code });
    await finalizeSignIn();
  };

  const verifySecondFactor = async () => {
    setFormError(null);

    if (selectedStrategy === "phone_code") {
      await signIn.mfa.verifyPhoneCode({ code });
    } else if (selectedStrategy === "totp") {
      await signIn.mfa.verifyTOTP({ code });
    } else if (selectedStrategy === "backup_code") {
      await signIn.mfa.verifyBackupCode({ code });
    } else {
      return;
    }

    await finalizeSignIn();
  };

  const resendEmailCode = async () => {
    setCode("");
    await signIn.mfa.sendEmailCode();
  };

  const resendPhoneCode = async () => {
    setCode("");
    await signIn.mfa.sendPhoneCode();
  };

  return {
    // state
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
    supportedSecondFactors,
    selectedStrategy,
    // actions
    signInWithPassword,
    verifyEmailCode,
    verifySecondFactor,
    selectSecondFactor,
    resendEmailCode,
    resendPhoneCode,
  };
}
