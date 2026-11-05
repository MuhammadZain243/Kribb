import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "solid" | "link";
};

export default function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "solid",
}: Props) {
  if (variant === "link") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.6}
        className="py-2 items-center"
      >
        <Text className="text-blue-600 font-semibold">{label}</Text>
      </TouchableOpacity>
    );
  }

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`w-full h-14 rounded-2xl bg-blue-600 items-center justify-center ${
        isDisabled ? "opacity-60" : ""
      }`}
      style={{
        elevation: 4,
        shadowColor: "#2563EB",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-base font-bold">{label}</Text>
      )}
    </TouchableOpacity>
  );
}
