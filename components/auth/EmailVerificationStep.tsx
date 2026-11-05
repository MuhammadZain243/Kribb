import OTPInput from "@/components/OTPInput";
import { SignInFlow } from "@/hooks/useSignInFlow";
import React from "react";
import { Text, View } from "react-native";
import AuthLayout from "./AuthLayout";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

type Props = { flow: SignInFlow };

export default function EmailVerificationStep({ flow }: Props) {
  const {
    email,
    code,
    setCode,
    errors,
    formError,
    isLoading,
    verifyEmailCode,
    resendEmailCode,
  } = flow;

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a verification code to ${email}. Enter it below to continue.`}
    >
      <ErrorMessage message={formError} />

      <OTPInput code={code} setCode={setCode} />

      {errors.fields?.code && (
        <Text className="text-red-500 text-sm mt-1 mb-2 ml-1">
          {errors.fields.code.message}
        </Text>
      )}

      <View className="mt-4 mb-2">
        <Button
          label="Verify Email"
          onPress={verifyEmailCode}
          loading={isLoading}
        />
      </View>

      <Button
        variant="link"
        label="Resend verification code"
        onPress={resendEmailCode}
        disabled={isLoading}
      />
    </AuthLayout>
  );
}
