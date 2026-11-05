import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

type Props = {
  icon?: IconName;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  icon = "home-work",
  title = "No properties found",
  message = "There are no listings available right now. Pull down to refresh or check back a little later.",
  actionLabel = "Refresh",
  onAction,
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify().damping(16)}
      className="items-center justify-center px-8 mt-16"
    >
      <View className="w-40 h-40 rounded-full bg-blue-50 items-center justify-center">
        <View className="w-28 h-28 rounded-full bg-blue-100 items-center justify-center">
          <View className="w-16 h-16 rounded-full bg-blue-600 items-center justify-center shadow-lg">
            <MaterialIcons name={icon} size={32} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <Text className="text-gray-900 text-xl font-bold mt-8 text-center">
        {title}
      </Text>
      <Text className="text-gray-500 text-base text-center mt-2 leading-6">
        {message}
      </Text>

      {onAction ? (
        <Pressable
          onPress={onAction}
          className="flex-row items-center bg-blue-600 px-6 py-3 rounded-full mt-6 active:opacity-80"
        >
          <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold ml-2">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
