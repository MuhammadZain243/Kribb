import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: Props) {
  return (
    <View className="flex-row items-center justify-between px-5 mt-8 mb-4">
      <View>
        <Text className="text-gray-900 text-xl font-bold">{title}</Text>
        {subtitle ? (
          <Text className="text-gray-500 text-sm mt-0.5">{subtitle}</Text>
        ) : null}
      </View>

      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          className="flex-row items-center active:opacity-60"
        >
          <Text className="text-blue-600 font-semibold">{actionLabel}</Text>
          <MaterialIcons name="chevron-right" size={20} color="#2563EB" />
        </Pressable>
      ) : null}
    </View>
  );
}
