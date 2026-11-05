import OTPInput from "@/components/OTPInput";
import { SignUpFlow } from "@/hooks/useSignUpFlow";
import React from "react";
import { Text, View } from "react-native";
import AuthLayout from "./AuthLayout";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

type Props = { flow: SignUpFlow };

export default function SignUpVerifyStep({ flow }: Props) {
  const {
    verifyingEmail,
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
      subtitle={`We sent a verification code to ${verifyingEmail}. Enter it below to finish creating your account.`}
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
