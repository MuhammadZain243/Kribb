import { AlertCircle, Check } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

type Step = "verifying" | "syncing";
type RowState = "pending" | "active" | "done" | "error";

type Props = {
  step: Step;
  /** When set, the syncing row turns red and retry / sign-out are offered. */
  error?: string | null;
  onRetry?: () => void;
  onSignOut?: () => void;
};

const TEXT_CLASS: Record<RowState, string> = {
  pending: "text-gray-400",
  active: "text-blue-700 font-semibold",
  done: "text-gray-900",
  error: "text-red-600 font-semibold",
};

function StepIcon({ state }: { state: RowState }) {
  if (state === "done") {
    return (
      <Animated.View
        entering={ZoomIn.springify().damping(12)}
        className="w-8 h-8 rounded-full bg-green-500 items-center justify-center"
      >
        <Check size={18} color="#FFFFFF" strokeWidth={3} />
      </Animated.View>
    );
  }

  if (state === "active") {
    return (
      <View className="w-8 h-8 items-center justify-center">
        <ActivityIndicator color="#2563EB" />
      </View>
    );
  }

  if (state === "error") {
    return (
      <View className="w-8 h-8 rounded-full bg-red-500 items-center justify-center">
        <AlertCircle size={18} color="#FFFFFF" />
      </View>
    );
  }

  return <View className="w-8 h-8 rounded-full border-2 border-gray-200" />;
}

function StepRow({
  label,
  state,
  delay,
}: {
  label: string;
  state: RowState;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(16)}
      className="flex-row items-center py-3"
    >
      <StepIcon state={state} />
      <Text className={`ml-4 text-base ${TEXT_CLASS[state]}`}>{label}</Text>
    </Animated.View>
  );
}

export default function SetupProgress({
  step,
  error,
  onRetry,
  onSignOut,
}: Props) {
  const verifyState: RowState = step === "syncing" ? "done" : "active";
  const syncState: RowState = error
    ? "error"
    : step === "syncing"
      ? "active"
      : "pending";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <Image
          source={require("@/assets/images/kribb.png")}
          className="w-32 h-14 mb-10"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-gray-900">
          {error ? "Something went wrong" : "Setting things up"}
        </Text>
        <Text className="text-gray-500 text-base leading-6 mt-2 mb-8">
          {error
            ? "We couldn't finish setting up your account."
            : "This only takes a moment."}
        </Text>

        <View className="bg-gray-50 rounded-3xl px-5 py-2">
          <StepRow
            label="Verifying your account"
            state={verifyState}
            delay={0}
          />
          <View className="h-px bg-gray-100" />
          <StepRow label="Syncing your data" state={syncState} delay={120} />
        </View>

        {error ? (
          <View className="mt-6">
            <ErrorMessage message={error} />
            {onRetry && <Button label="Try again" onPress={onRetry} />}
            {onSignOut && (
              <View className="mt-2">
                <Button variant="link" label="Sign out" onPress={onSignOut} />
              </View>
            )}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
