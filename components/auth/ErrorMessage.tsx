import { AlertCircle } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  message?: string | null;
};

export default function ErrorMessage({ message }: Props) {
  if (!message) return null;

  return (
    <View className="flex-row items-start bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
      <AlertCircle size={18} color="#EF4444" style={{ marginTop: 2 }} />
      <Text className="flex-1 ml-2.5 text-red-600 text-sm leading-5">
        {message}
      </Text>
    </View>
  );
}
