import { getGreeting } from "@/utils/format";
import React from "react";
import { Image, Text, View } from "react-native";

type Props = {
  firstName?: string | null;
  imageUrl?: string;
};

export default function HomeHeader({ firstName, imageUrl }: Props) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
      <View className="flex-row items-center flex-1">
        <Image
          source={{ uri: imageUrl }}
          className="w-12 h-12 rounded-full bg-gray-200"
        />
        <View className="ml-3 flex-1">
          <Text className="text-gray-500 text-sm">{getGreeting()} 👋</Text>
          <Text className="text-gray-900 text-lg font-bold" numberOfLines={1}>
            {firstName ?? "Guest"}
          </Text>
        </View>
      </View>

      <Image
        source={require("@/assets/images/kribb.png")}
        style={{ width: 80, height: 32 }}
        resizeMode="contain"
      />
    </View>
  );
}
