import { getPasswordChecks, getPasswordStrength } from "@/utils/password";
import { Check, Circle } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

type Props = {
  password: string;
};

export default function PasswordStrength({ password }: Props) {
  if (!password) return null;

  const { score, label, color } = getPasswordStrength(password);
  const checks = getPasswordChecks(password);

  return (
    <Animated.View entering={FadeIn.duration(200)} className="-mt-1 mb-5">
      {/* Meter */}
      <View className="flex-row items-center">
        <View className="flex-1 flex-row gap-1.5">
          {[1, 2, 3, 4].map((segment) => (
            <View
              key={segment}
              className="flex-1 h-1.5 rounded-full"
              style={{ backgroundColor: segment <= score ? color : "#E5E7EB" }}
            />
          ))}
        </View>
        <Text className="ml-3 text-xs font-semibold" style={{ color }}>
          {label}
        </Text>
      </View>

      {/* Checklist */}
      <View className="mt-3 gap-1.5">
        {checks.map((check) => (
          <View key={check.id} className="flex-row items-center">
            {check.passed ? (
              <Check size={14} color="#22C55E" strokeWidth={3} />
            ) : (
              <Circle size={14} color="#D1D5DB" />
            )}
            <Text
              className={`ml-2 text-xs ${
                check.passed ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {check.label}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
