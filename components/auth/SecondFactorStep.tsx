import OTPInput from "@/components/OTPInput";
import { SecondFactorStrategy, SignInFlow } from "@/hooks/useSignInFlow";
import {
  Check,
  KeyRound,
  MessageSquare,
  Smartphone,
  type LucideIcon,
} from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AuthInput from "./AuthInput";
import AuthLayout from "./AuthLayout";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

type Props = { flow: SignInFlow };

const FACTOR_META: Record<
  SecondFactorStrategy,
  { label: string; description: string; prompt: string; icon: LucideIcon }
> = {
  phone_code: {
    label: "Text message",
    description: "Get a code on your phone",
    prompt: "the code sent to your phone",
    icon: MessageSquare,
  },
  totp: {
    label: "Authenticator app",
    description: "Use the code from your app",
    prompt: "the code from your authenticator app",
    icon: Smartphone,
  },
  backup_code: {
    label: "Backup code",
    description: "Use one of your saved codes",
    prompt: "one of your backup codes",
    icon: KeyRound,
  },
};

export default function SecondFactorStep({ flow }: Props) {
  const {
    code,
    setCode,
    errors,
    formError,
    isLoading,
    supportedSecondFactors,
    selectedStrategy,
    selectSecondFactor,
    verifySecondFactor,
    resendPhoneCode,
  } = flow;

  const prompt = selectedStrategy
    ? FACTOR_META[selectedStrategy].prompt
    : "your verification code";

  return (
    <AuthLayout
      title="Two-step verification"
      subtitle={`Enter ${prompt} to finish signing in.`}
    >
      <ErrorMessage message={formError} />

      {/* Method picker, only when there is a choice */}
      {supportedSecondFactors.length > 1 && (
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-3">
            Verification method
          </Text>

          {supportedSecondFactors.map((strategy) => {
            const meta = FACTOR_META[strategy];
            const Icon = meta.icon;
            const selected = selectedStrategy === strategy;

            return (
              <TouchableOpacity
                key={strategy}
                onPress={() => selectSecondFactor(strategy)}
                disabled={isLoading}
                activeOpacity={0.8}
                className={`flex-row items-center rounded-2xl border px-4 py-3 mb-3 ${
                  selected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    selected ? "bg-blue-600" : "bg-gray-100"
                  }`}
                >
                  <Icon size={20} color={selected ? "#FFFFFF" : "#64748B"} />
                </View>

                <View className="flex-1 ml-3">
                  <Text
                    className={`font-semibold ${
                      selected ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    {meta.label}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {meta.description}
                  </Text>
                </View>

                {selected && <Check size={20} color="#2563EB" />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Code entry */}
      {selectedStrategy === "backup_code" ? (
        <AuthInput
          icon={KeyRound}
          placeholder="Enter your backup code"
          value={code}
          onChangeText={setCode}
          autoCapitalize="none"
          autoCorrect={false}
        />
      ) : (
        <OTPInput code={code} setCode={setCode} />
      )}

      {errors.fields?.code && (
        <Text className="text-red-500 text-sm mt-1 mb-2 ml-1">
          {errors.fields.code.message}
        </Text>
      )}

      <View className="mt-4 mb-2">
        <Button
          label="Verify"
          onPress={verifySecondFactor}
          loading={isLoading}
        />
      </View>

      {selectedStrategy === "phone_code" && (
        <Button
          variant="link"
          label="Resend verification code"
          onPress={resendPhoneCode}
          disabled={isLoading}
        />
      )}
    </AuthLayout>
  );
}
