import { ChevronRight, type LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  icon: LucideIcon;
  label: string;
  description?: string;
  onPress: () => void;
};

export default function MenuRow({
  icon: Icon,
  label,
  description,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-4 active:bg-gray-50"
    >
      <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
        <Icon size={20} color="#2563EB" />
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-gray-900 font-semibold text-base">{label}</Text>
        {description ? (
          <Text className="text-gray-500 text-sm mt-0.5">{description}</Text>
        ) : null}
      </View>

      <ChevronRight size={20} color="#9CA3AF" />
    </Pressable>
  );
}
