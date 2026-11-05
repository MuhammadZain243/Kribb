import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { primaryShadow, softShadow } from "./shadows";

type Props = {
  onPress: () => void;
  onFilterPress?: () => void;
  placeholder?: string;
};

export default function HomeSearchBar({
  onPress,
  onFilterPress,
  placeholder = "Search city, area or property",
}: Props) {
  return (
    <View className="flex-row items-center px-5 mt-4">
      <Pressable
        onPress={onPress}
        className="flex-1 flex-row items-center bg-white h-14 px-4 rounded-2xl border border-gray-100 active:opacity-80"
        style={softShadow}
      >
        <MaterialIcons name="search" size={24} color="#94A3B8" />
        <Text className="flex-1 ml-3 text-gray-400 text-base">
          {placeholder}
        </Text>
      </Pressable>

      <Pressable
        onPress={onFilterPress ?? onPress}
        className="w-14 h-14 ml-3 rounded-2xl bg-blue-600 items-center justify-center active:opacity-80"
        style={primaryShadow}
      >
        <MaterialIcons name="tune" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
